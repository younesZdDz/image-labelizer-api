import express from 'express';
import controller from './controller';

const router = express.Router();

router.put('/reset', controller.reset);

router.get('/status/:status/:page?', controller.getAnnotationByStatus);

router.get('/:_id', controller.getAnnotationById);

router.put('/:_id', controller.updateAnnotation);

router.post('/', controller.addAnnotation);

export default router;
