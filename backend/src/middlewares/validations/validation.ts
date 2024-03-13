import {NextFunction, Request, Response} from 'express';

import {pick} from '@/utils';
import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../errors/ApiError';

/**
 * Middleware to validate request data against Joi schemas.
 * @param {Record<string, any>} schema - Joi validation schema.
 */
const validate =
	(schema: Record<string, any>) =>
	(req: Request, _res: Response, next: NextFunction): void => {
		// Extract and log the valid schema for debugging
		const validSchema = pick(schema, ['params', 'query', 'body']);

		// Extract and log the object to be validated for debugging
		const object = pick(req, Object.keys(validSchema));

		// Perform validation using Joi
		const {value, error} = Joi.compile(validSchema)
			.prefs({
				abortEarly: false,
				allowUnknown: false,
				errors: {
					label: 'key'
				}
			})
			.validate(object);

		// If validation fails, handle errors gracefully
		if (error) {
			const errorMessages = error.details.map(details => details.message);
			const errorMessage = `Validation error: ${errorMessages.join(', ')}`;

			// Log the error for debugging
			console.error(errorMessage);

			// Return a detailed error response
			return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, true));
		}

		// If validation passes, assign the validated values to the request object
		Object.assign(req, value);
		return next();
	};

export default validate;
