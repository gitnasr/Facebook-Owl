import {ICreateOwner, IFindOwner, IOwnerDocP, IOwnerDocsP, IUpdateOwner} from '@/types';

import {FacebookService} from '.';
import {ObjectId} from 'mongoose';
import {Owner} from '@/models';
import {nanoid} from 'nanoid';

export const findAccountByOptions = async (options: IFindOwner): IOwnerDocP => {
	return Owner.findOne({
		...options
	});
};

export const createOwner = async (Payload: ICreateOwner): IOwnerDocP => {
	const {accountId, accountName, cookies, browserId, count, country} = Payload;
	const profilePic = await FacebookService.getProfilePicture(accountId, cookies);
	const oId = nanoid(32);

	return await Owner.create({
		accountId,
		accountName,
		profilePic: profilePic?.url,
		friendsCount: count,
		oId,
		friendList: [],
		browserId,
		country
	});
};

export const updateOwner = async (options: IFindOwner, update: IUpdateOwner): IOwnerDocP => {
	return await Owner.findOneAndUpdate(options, update, {
		new: true
	});
};

export const pushFriendListToOwner = async (ownerId: string, browserId: string, listId: ObjectId, count: number): IOwnerDocP => {
	return Owner.findOneAndUpdate(
		{oId: ownerId, browserId},
		{
			$push: {
				friendList: listId
			},
			friendsCount: count
		}
	);
};

export const findOwnerByBrowserId = async (browserId: string, limit: number = 10): IOwnerDocsP => {
	return Owner.find({browserId}).sort({createdAt: -1}).limit(limit);
};
