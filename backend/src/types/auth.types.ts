import {Document, Model, ObjectId} from 'mongoose';
import {ICookie, RequestIP} from './u.types';

import {Request} from 'express';
import {JwtPayload} from 'jsonwebtoken';

interface IUser {
	browserId: string;
	browserVersion: number;
	browserType: string;
	ownerId?: ObjectId;
	country: string;
}
export interface IHistory extends JwtPayload {
	ownerId: string;
	browserId: string;
	iat: number;
	exp: number;
}

export interface ILogin {
	browserId: string;
	accountId: number;
	browserType: string;
	count: number;
	accountName: string;
	browserVersion: number;
	cookies: ICookie[];
}
export interface ICreateOwner {
	browserId: string;
	accountId: number;
	accountName: string;
	count: number;
	cookies: ICookie[];
	country: string;
}

export interface IRequest extends Request {
	ipinfo?: RequestIP;
	body: ILogin;
}
export interface IUserDoc extends IUser, Document {}
export interface IUserModel extends Model<IUserDoc> {}
