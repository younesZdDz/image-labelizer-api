import httpStatus from 'http-status';
import express from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import config from '../config';

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction, isRefresh: boolean) => {
    const { authorization } = req.headers;

    const apiError = new ApiError({
        message: 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
    });

    // eslint-disable-next-line @typescript-eslint/ban-types
    let accessResult: string | object = '';

    if (!authorization) {
        return next(apiError);
    }

    if (isRefresh) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next(apiError);
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        try {
            jwt.verify(refreshToken, config.JWT.jwtRefreshSecret);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                apiError.message = 'Refresh token expired';
            } else {
                apiError.message = 'Malformed refresh token';
            }
            return next(apiError);
        }
    } else {
        try {
            accessResult = jwt.verify(authorization, config.JWT.jwtAccessSecret);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                apiError.message = 'Access token expired';
            } else {
                apiError.message = 'Malformed access token';
            }
            return next(apiError);
        }
    }
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    req.userId = accessResult._id;
    return next();
};

export const authorize: (isRefresh?: boolean) => express.Handler = (isRefresh = false) => {
    return (req, res, next) => {
        return auth(req, res, next, isRefresh);
    };
};
