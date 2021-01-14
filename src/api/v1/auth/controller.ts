import httpStatus from 'http-status';
import { DateTime } from 'luxon';
import express from 'express';
import User, { IUser } from './model';
import { ApiError } from '../../../utils/ApiError';
import config from '../../../config';

async function generateTokenResponse(user: IUser) {
    const accessToken = user.token();
    const refreshToken = user.token(false);
    const accessExpiresIn = DateTime.local().plus({ seconds: config.JWT.jwtAccessLife }).toSeconds();
    const refreshExpiresIn = DateTime.local().plus({ seconds: config.JWT.jwtRefreshLife }).toSeconds();
    // eslint-disable-next-line no-param-reassign
    user.sessions = [
        ...user.sessions,
        {
            access_token: accessToken,
            refresh_token: refreshToken,
            access_exp: accessExpiresIn,
            refresh_exp: refreshExpiresIn,
        },
    ];
    user.save();

    return { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn };
}

const register: express.Handler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const isEmailExists = await User.findOne({ email }, { _id: 0 });

        if (isEmailExists) {
            throw new ApiError({
                message: 'Email address already exists',
                status: httpStatus.CONFLICT,
            });
        }
        await new User({
            email,
            password,
        }).save();

        return res.status(httpStatus.CREATED).json();
    } catch (error) {
        return next(error);
    }
};

const login: express.Handler = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne(
            { email },
            {
                _id: 1,
                email: 1,
                sessions: 1,
                password: 1,
            },
        );
        if (!user) {
            throw new ApiError({
                message: 'Credentials did not match',
                status: httpStatus.UNAUTHORIZED,
            });
        }
        const passwordMatches = await user.passwordMatches(password);

        if (!passwordMatches) {
            throw new ApiError({
                message: 'Credentials did not match',
                status: httpStatus.UNAUTHORIZED,
            });
        }

        const token = await generateTokenResponse(user);

        res.set('authorization', token.accessToken);
        res.set('x-refresh-token', token.refreshToken);
        res.set('x-access-expiry-time', `${token.accessExpiresIn}`);
        res.set('x-refresh-expiry-time', `${token.refreshExpiresIn}`);

        res.status(httpStatus.OK);

        return res.json({
            email: user.email,
        });
    } catch (error) {
        return next(error);
    }
};

const isLoggedIn: express.Handler = async (req, res) => {
    return res.status(httpStatus.OK).json();
};

const refreshUserToken: express.Handler = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const user = await User.findOne({
            sessions: { $elemMatch: { refresh_token: refreshToken } },
        });

        if (!user) {
            throw new ApiError({
                message: 'Refresh token did not match',
                status: httpStatus.UNAUTHORIZED,
            });
        }

        const accessToken = user.token();
        const accessExpiresIn = DateTime.local().plus({ seconds: config.JWT.jwtAccessLife }).toSeconds();

        await User.updateOne(
            // eslint-disable-next-line no-underscore-dangle
            { _id: user._id, 'sessions.refresh_token': refreshToken },
            {
                'sessions.$.access_token': accessToken,
                'sessions.$.access_exp': accessExpiresIn,
            },
        );

        res.set('authorization', accessToken);
        res.set('x-access-expiry-time', `${accessExpiresIn}`);

        return res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
        return next(error);
    }
};

const logout: express.Handler = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const user = await User.findOne({
            sessions: { $elemMatch: { refresh_token: refreshToken } },
        });

        if (!user) {
            throw new ApiError({
                message: 'Refresh token did not match',
                status: httpStatus.UNAUTHORIZED,
            });
        }

        await User.updateOne(
            // eslint-disable-next-line no-underscore-dangle
            { _id: user._id, 'sessions.refresh_token': refreshToken },
            { $pull: { sessions: { refresh_token: refreshToken } } },
        );

        return res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
        return next(error);
    }
};

export default {
    register,
    login,
    refreshUserToken,
    isLoggedIn,
    logout,
};
