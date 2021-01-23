import dotenv from 'dotenv';

dotenv.config();

export default {
    SECURITY: {
        whitelist: process.env.WHITE_LIST,
        ddosConfig: {
            limit: process.env.DDOS_CONFIG_LIMIT,
            burst: process.env.DDOS_CONFIG_BURST,
        },
    },
    SERVER: {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        baseUrl: `${process.env.BASE_URL}:${process.env.PORT}`,
        website: process.env.WEBSITE,
        logsConfig: {
            date: true,
            url: true,
            method: true,
            headers: true,
            pathParam: true,
            bodyParam: true,
            queryParam: true,
        },
    },
    DB: {
        mongoURI:
            `mongodb://${process.env.MONGO_USER}:` +
            `${process.env.MONGO_USER_SECRET}@${process.env.MONGO_HOST}:` +
            `${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    },
    JWT: {
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'qsdgjqshdgjh8ç!ç@__',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '098089qkshdq!à°!ç@__',
        jwtAccessLife: parseInt(process.env.JWT_ACCESS_LIFE || '900', 10),
        jwtRefreshLife: parseInt(process.env.JWT_REFRESH_LIFE || '86400', 10),
    },
};
