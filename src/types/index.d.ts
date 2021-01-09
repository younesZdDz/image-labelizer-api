import expressValidation from 'express-validation';
import { ApiError } from '../utils/ApiError';

export type ErrorType = Error | ApiError | expressValidation.ValidationError;
