import express from 'express';
import httpStatus from 'http-status';
import annotationRoutes from './annotation/routes';

const router = express.Router();

router.get('/status', (req, res) => {
    return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: 'OK' });
});

router.use('/annotation', annotationRoutes);

export default router;
