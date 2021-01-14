import express from 'express';
import httpStatus from 'http-status';
import Annotation from './model';

const reset: express.Handler = async (req, res, next) => {
    try {
        const response = await Annotation.updateMany(
            {},
            {
                $set: { status: 'pending' },
            },
        );
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return next(error);
    }
};
const getAnnotationByStatus: express.Handler = async (req, res, next) => {
    const perPage = 4;
    try {
        const { status } = req.params;
        const page = req.params.page ? parseInt(req.params.page, 10) : 1;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response = await Annotation.find({ status })
            .limit(perPage)
            .skip(perPage * (page - 1));
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return next(error);
    }
};

const getAnnotationById: express.Handler = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const response = await Annotation.findById(_id);
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return next(error);
    }
};

const updateAnnotation: express.Handler = async (req, res, next) => {
    const { _id } = req.params;
    const { annotations, comment } = req.body;

    try {
        const response = await Annotation.updateOne(
            { _id },
            {
                $set: {
                    'response.annotations': annotations,
                    'response.comment': comment,
                    completed_at: new Date(),
                    status: 'completed',
                },
            },
        );
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return next(error);
    }
};

const addAnnotation: express.Handler = async (req, res, next) => {
    const { instruction, attachmentType, attachment, objectsToAnnotate } = req.body;
    const annotation = new Annotation({ instruction, params: { attachmentType, attachment, objectsToAnnotate } });
    try {
        const response = await annotation.save();
        return res.status(httpStatus.OK).send(response);
    } catch (error) {
        return next(error);
    }
};
export default {
    reset,
    getAnnotationByStatus,
    getAnnotationById,
    updateAnnotation,
    addAnnotation,
};
