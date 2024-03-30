import {config, handlers} from './config';
import express, {Express} from 'express';
import ipinfo, {originatingIPSelector} from 'ipinfo-express';

import {ApiError} from '@/middlewares/errors';
import {Errors} from '@/middlewares';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import {v2 as cloudinary} from 'cloudinary';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import routes from '@/routes';

cloudinary.config({
	cloud_name: config.cloudinary.cloudName,
	api_key: config.cloudinary.apiKey,
	api_secret: config.cloudinary.apiSecret,
	secure: true
});
const app: Express = express();

app.use(helmet());
app.use(cors());

app.use(express.json({limit: '50mb'}));
app.use(
	express.urlencoded({
		extended: false
	})
);
app.use(ExpressMongoSanitize());
app.use(compression());

app.use(
	ipinfo({
		token: config.ipinfo.token,
		cache: null,
		timeout: 5000,
		ipSelector: originatingIPSelector
	})
);
app.use(handlers.successHandler);
app.use(handlers.errorHandler);
app.use('/api', routes);

app.use((req, res, next) => {
	next(new ApiError(404, 'Not found'));
});
// convert error to ApiError, if needed
app.use(Errors.errorConverter);

// handle error
app.use(Errors.errorHandler);

app.listen(config.port, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});

mongoose
	.connect(config.mongoose.url)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(err => {
		console.error('Error connecting to MongoDB: ', err);
		process.exit(1);
	});
