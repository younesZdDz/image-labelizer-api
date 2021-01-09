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
};
