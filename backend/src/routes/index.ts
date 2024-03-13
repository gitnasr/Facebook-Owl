import express, {Router} from 'express';

import authRoute from './auth.route';
import syncRoute from './sync.route';

const router = express.Router();

interface IRoute {
	path: string;
	route: Router;
}

const defaultIRoute: IRoute[] = [
	{
		path: '/auth',
		route: authRoute
	},
	{
		path: '/sync',
		route: syncRoute
	}
];

defaultIRoute.forEach(route => {
	router.use(route.path, route.route);
});

export default router;
