import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import Ddos from 'ddos';
import ExpressLogs from 'express-server-logs';
import httpStatus from 'http-status';
import routes from './api/v1/router';
import error from './middlewares/error';
import config from './config';
import { ApiError } from './utils/ApiError';

const ddosInstance = new Ddos(config.SECURITY.ddosConfig);

const corsOptions: CorsOptions = {
    exposedHeaders: 'authorization, x-refresh-token, x-access-expiry-time, x-refresh-expiry-time',
    origin: (origin, callback) => {
        if (origin && (!config.SECURITY.whitelist || config.SECURITY.whitelist.includes(origin))) {
            callback(null, true);
        } else {
            callback(new ApiError({ message: 'Not allowed by CORS', status: httpStatus.UNAUTHORIZED }));
        }
    },
};

const server = express();
const xlogs = new ExpressLogs(false);

server.use((req, res, next) => {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
});

// npm module for preventing ddos attack. See more
// https://www.npmjs.com/package/ddos
server.use(ddosInstance.express);

// parse body params and attache them to req.body
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(xlogs.logger);

// gzip compression
server.use(compress());

// secure servers by setting various HTTP headers
server.use(helmet());

// enable CORS - Cross Origin Resource Sharing
server.use(cors(corsOptions));

// mount api v1 routes
server.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
server.use(error.converter);

// catch 404 and forward to error handler
server.use(error.notFound);

process.on('unhandledRejection', (reason) => {
    // I just caught an unhandled promise rejection,
    // since we already have fallback handler for unhandled errors (see below),
    // let throw and let him handle that
    throw reason;
});
// eslint-disable-next-line no-unused-vars
server.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(`uncaughtException error: ${err}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
    });
    // ? process.exit(1);
});

export default server;
