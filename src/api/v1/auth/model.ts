import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import config from '../../../config';

export interface IUser extends Document {
    email: string;
    password: string;
    sessions: {
        // eslint-disable-next-line camelcase
        access_token: string;
        // eslint-disable-next-line camelcase
        refresh_token: string;
        // eslint-disable-next-line camelcase
        refresh_exp: number;
        // eslint-disable-next-line camelcase
        access_exp: number;
    }[];
    // eslint-disable-next-line camelcase
    created_at: number;
    // eslint-disable-next-line camelcase
    updated_at: number;
    passwordMatches: (password: string) => boolean;
    token: (access?: boolean) => string;
}

const userSchema = new Schema({
    email: { type: String },
    password: { type: String },
    sessions: [
        {
            access_token: { type: String },
            refresh_token: { type: String },
            refresh_exp: { type: Number },
            access_exp: { type: Number },
        },
    ],
    created_at: {
        default: DateTime.local().toSeconds(),
        type: Number,
    },
    updated_at: {
        default: DateTime.local().toSeconds(),
        type: Number,
    },
    role: {
        default: 'user',
        enum: ['user'],
        type: String,
    },
});

userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next();

        const rounds = config.SERVER.env === 'test' ? 1 : 10;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const hash = await bcrypt.hash(this.password, rounds);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.method({
    async passwordMatches(password: string) {
        const result = await bcrypt.compare(password, this.password);

        return result;
    },
    token(isAccess = true) {
        const date = DateTime.local();
        const payload = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            _id: this._id,
            exp: date.plus({ seconds: isAccess ? config.JWT.jwtAccessLife : config.JWT.jwtRefreshLife }).toSeconds(),
            iat: date.toSeconds(),
        };

        return jwt.sign(payload, isAccess ? config.JWT.jwtAccessSecret : config.JWT.jwtRefreshSecret);
    },
});

userSchema.index(
    {
        email: 1,
    },
    { unique: true },
);

const model = mongoose.model<IUser>('User', userSchema);

export default model;
