import Joi from '@hapi/joi';

const headers = {
    headers: Joi.object({
        authorization: Joi.string().trim().required().label('Auth Token'),
    }).options({ allowUnknown: true }),
};
export default {
    // POST /v1/user/register
    register: {
        body: Joi.object({
            email: Joi.string().email().lowercase().trim().required(),
            password: Joi.string().min(8).max(16).required().trim(),
        }),
    },
    // POST /v1/user/login
    login: {
        body: Joi.object({
            email: Joi.string().email().lowercase().trim().required(),
            password: Joi.string().min(6).max(16).required().trim(),
        }),
    },

    // POST /v1/user/is-logged-in
    isLoggedIn: {
        ...headers,
    },
    // Get /v1/user/refresh-token
    refreshToken: {
        ...headers,
        body: Joi.object({
            refreshToken: Joi.string().required().trim().label('Refresh Token'),
        }),
    },
};
