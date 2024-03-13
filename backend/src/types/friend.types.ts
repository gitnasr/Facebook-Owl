import {Document, Model} from 'mongoose';

export interface IFriend {
	firstName: string;
	lastName: string;
	profilePicture: string;
	accountId: number;
	fId: string;
	fullName: string;
	status?: string;
	addedOn?: Date;
}

export interface IProfilePicture {
	url: string;
	id: string;
	hash: string;
}
export interface IFriendDoc extends IFriend, Document {}
export interface IFriendModel extends Model<IFriendDoc> {}
export interface IUpdateFriend extends Partial<IFriend> {}
