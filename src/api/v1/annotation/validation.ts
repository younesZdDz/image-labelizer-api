import Joi from '@hapi/joi';

const headers = {
    headers: Joi.object({
        authorization: Joi.string().trim().required().label('Auth Token'),
    }).options({ allowUnknown: true }),
};
export default {
    // PUT /v1/annotation/reset
    reset: {
        ...headers,
    },
    // GET  /v1/annotation/status/:status/:page?
    getAnnotationByStatus: {
        ...headers,
        params: Joi.object({
            status: Joi.string().lowercase().trim().valid('pending', 'completed').required(),
            page: Joi.number().min(1).optional(),
        }),
    },

    // GET  /v1/annotation/:_id
    getAnnotationById: {
        ...headers,
        params: Joi.object({
            _id: Joi.string().trim().required(),
        }),
    },
    // PUT  /v1/annotation/:_id
    updateAnnotation: {
        ...headers,
        params: Joi.object({
            _id: Joi.string().trim().required(),
        }),
        body: Joi.object({
            comment: Joi.string().trim().allow('').optional(),
            annotations: Joi.array()
                .items(
                    Joi.object({
                        left: Joi.number().min(0).required(),
                        top: Joi.number().min(0).required(),
                        width: Joi.number().min(0).required(),
                        height: Joi.number().min(0).required(),
                        label: Joi.string().trim().required(),
                    }),
                )
                .required(),
        }),
    },
    // POST  /v1/annotation
    addAnnotation: {
        ...headers,
        body: Joi.object({
            instruction: Joi.string().trim().required(),
            attachment: Joi.string().trim().required(),
            attachmentType: Joi.string().trim().valid('image').required(),
            objectsToAnnotate: Joi.array().items(Joi.string()).required(),
        }),
    },
};
