import {Document, Model, ObjectId} from 'mongoose';
import {ICookie, RequestIP} from './u.types';

import { IFriend } from './friend.types';
import {Request} from 'express';

interface IUser {
	browserId: string;
	browserVersion: number;
	browserType: string;
	ownerId?: ObjectId;
	country: string;
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

export interface IAuthRequest extends Request {
	ipinfo?: RequestIP;
	body: ILogin;
}
export interface IUserDoc extends IUser, Document {}
export interface IUserModel extends Model<IUserDoc> {}
export type IAccountPromised = Promise<{removed: IFriend[]; remaining: IFriend[]}>;
