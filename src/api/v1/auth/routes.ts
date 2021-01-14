import express from 'express';
import { validate } from 'express-validation';
import controller from './controller';
import validation from './validation';
import { authorize } from '../../../middlewares/auth';
import config from '../../../config';

const routes = express.Router();

if (config.SERVER.env !== 'production') {
    routes.route('/register').post(validate(validation.register), controller.register);
}

routes.route('/login').post(validate(validation.login), controller.login);

routes.route('/is-logged-in').get(validate(validation.isLoggedIn), authorize(), controller.isLoggedIn);

routes.route('/refresh-token').put(validate(validation.refreshToken), authorize(true), controller.refreshUserToken);

routes.route('/logout').put(validate(validation.refreshToken), controller.logout);

export default routes;
