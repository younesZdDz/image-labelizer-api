import httpStatus from 'http-status';
import express from 'express';
import expressValidation from 'express-validation';
import { ApiError } from '../utils/ApiError';
import config from '../config';
import { ErrorType } from '../types/index.d';

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
// eslint-disable-next-line no-unused-vars
const handler = (err: ApiError, req: express.Request, res: express.Response, next?: express.NextFunction) => {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        stack: err.stack,
    };

    if (config.SERVER.env !== 'development') {
        delete response.stack;
    }
    if (err.status) {
        res.status(err.status);
    } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
    return res.json(response);
};

exports.handler = handler;

/**
 * If error is not an instanceOf {ExtendableError}, convert it.
 * @public
 */
// eslint-disable-next-line no-unused-vars
const converter: express.ErrorRequestHandler = (
    err: ErrorType,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    let convertedError: ApiError = err as ApiError;
    if (!(err instanceof ApiError) && !(err instanceof expressValidation.ValidationError)) {
        return next(err);
    } // ? Go crash
    if (err instanceof expressValidation.ValidationError) {
        const { details } = err;
        convertedError = new ApiError({
            message: JSON.stringify(details),
            status: httpStatus.BAD_REQUEST,
        });
    }

    return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound: express.Handler = (req, res) => {
    const err = new ApiError({
        message: 'Not Found',
        status: httpStatus.NOT_FOUND,
    });

    return handler(err, req, res);
};

export default { converter, notFound };
