import Joi from 'joi';

const LoginWithExtension = {
	body: Joi.object({
		browserId: Joi.string().min(12).max(64).required(),
		accountId: Joi.number().required(),
		accountName: Joi.string().required(),
		browserType: Joi.string().required(),
		browserVersion: Joi.number().required(),
		count: Joi.number().required(),
		cookies: Joi.array().required()
	})
};
const InfoValidation = {
	body: Joi.object({
		info: Joi.string().required()
	})
};
export default {
	LoginWithExtension,
	InfoValidation
};
