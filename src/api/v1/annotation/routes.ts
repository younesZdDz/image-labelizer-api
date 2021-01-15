import express from 'express';
import { validate } from 'express-validation';
import controller from './controller';
import validation from './validation';
import { authorize } from '../../../middlewares/auth';

const router = express.Router();

router.route('/reset').put(validate(validation.reset), authorize(), controller.reset);

router
    .route('/status/:status/:page?')
    .get(validate(validation.getAnnotationByStatus), authorize(), controller.getAnnotationByStatus);

router.route('/:_id').get(validate(validation.getAnnotationById), authorize(), controller.getAnnotationById);

router.route('/:_id').put(validate(validation.updateAnnotation), authorize(), controller.updateAnnotation);

router.route('/').post(validate(validation.addAnnotation), authorize(), controller.addAnnotation);

export default router;
