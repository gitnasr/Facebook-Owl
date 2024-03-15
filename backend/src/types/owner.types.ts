import {Document, Model} from 'mongoose';

import {ICookie} from './u.types';
import {IListDoc} from './list.types';

interface IOwner {
	accountName: string;
	accountId: number;
	browserId: string;
	profilePic: string;
	friendsCount: number;
	friendList: IListDoc[];
	oId: string;
	cookies: ICookie[];
	pp_hash: string;
}
export interface IFindOwner {
	oId?: string;
	accountId?: number;
	browserId?: string;
}

export interface IOwnerPayload extends Partial<IOwner> {
	expiresAt: string;
}
export type IOwnerDocP = Promise<IOwnerDoc | null>;
export type IOwnerDocsP = Promise<IOwnerDoc[]>;
export interface IOwnerDoc extends IOwner, Document {}
export interface IOwnerModel extends Model<IOwnerDoc> {}
export interface IUpdateOwner extends Partial<IOwner> {}
