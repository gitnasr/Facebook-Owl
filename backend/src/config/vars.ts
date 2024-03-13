import 'dotenv/config';

import Joi from 'joi';

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
		PORT: Joi.number().default(3000),
		MONGODB_URL: Joi.string().required().description('Mongo DB url'),
		JWT_SECRET_EXTENSION: Joi.string().required().description('JWT secret key'),
		CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
		API_KEY: Joi.string().required().description('Cloudinary api key'),
		API_SECRET: Joi.string().required().description('Cloudinary api secret'),
		ASE_PAYLOAD_SECRET: Joi.string().required().description('ASE secret key for extension payload'),
		IP: Joi.string().required().description('IP Info Api Key')
	})
	.unknown();

const {value: envVars, error} = envVarsSchema
	.prefs({
		errors: {
			label: 'key'
		}
	})
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}
const config = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	mongoose: {
		url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
		options: {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	},
	jwt: {
		extensionSecret: envVars.JWT_SECRET_EXTENSION,
		extensionPayloadSecret: envVars.ASE_PAYLOAD_SECRET
	},
	facebook: {
		accessToken: envVars.FACEBOOK_ACCESS_TOKEN
	},
	redis: {
		url: envVars.REDIS_URL
	},
	cloudinary: {
		cloudName: envVars.CLOUD_NAME,
		apiKey: envVars.API_KEY,
		apiSecret: envVars.API_SECRET
	},
	ipinfo: {
		token: envVars.IP
	}
};

export default config;
