import express from 'express';
import controller from './controller';
import { authorize } from '../../../middlewares/auth';

const router = express.Router();

router.route('/reset').put(authorize(), controller.reset);

router.route('/status/:status/:page?').get(authorize(), controller.getAnnotationByStatus);

router.route('/:_id').get(authorize(), controller.getAnnotationById);

router.route('/:_id').put(authorize(), controller.updateAnnotation);

router.route('/').post(authorize(), controller.addAnnotation);

export default router;
