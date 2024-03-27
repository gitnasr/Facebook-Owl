import {CloudinaryService, FacebookService, OwnerService} from '.';
import {DifferenceType, ICookie, IFriend, IHistoryResult, IListById, IListDoc, IListFind, IOwnerDoc, ListChanges, ListDifference, SyncSource} from '@/types';
import {List, Owner} from '@/models';

import {ObjectId} from 'mongoose';
import _ from 'underscore';
import {arr} from '@/utils';
import {logger} from '@/config';
import moment from 'moment';
import {nanoid} from 'nanoid';
import schedule from './jobs/emitter';

export const getLatestByOwnerIdAndBrowser = (ownerId: string, browserId: string, limit: number = 1): IListFind => {
	return List.find({oId: ownerId, bId: browserId}).sort({createdAt: -1}).limit(limit);
};

export const createBulkFriends = async (friends: IFriend[], cookies: ICookie[]): Promise<IFriend[]> => {
	const Friends: IFriend[] = [];
	const addedOn = moment().toDate();
	for (const friend of friends) {
		const fId = nanoid(6);
		let profilePicture = await FacebookService.getProfilePicture(friend.accountId, cookies);
		if (typeof profilePicture === 'undefined') {
			profilePicture = {
				url: `https://ui-avatars.com/api/?name=${friend.fullName}&background=random&size=200&rounded=true&color=fff&bold=true`,
				id: '',
				hash: ''
			};
		}
		const modifiedFriend: IFriend = {
			...friend,
			fId,
			profilePicture: profilePicture.url,
			status: 'new',
			addedOn
		};
		Friends.push(modifiedFriend);
	}
	return Friends;
};
export const createList = (ownerId: string, browserId: string, lId: string, friends: IFriend[], source: SyncSource, difference?: ListDifference[]) => {
	return List.create({
		bId: browserId,
		oId: ownerId,
		lId,
		friends,
		changes: difference,
		source
	});
};

export const getListById = async (lId: string, bId: string, oId: string): IListById => {
	const listById = await List.findOne({lId, bId, oId});
	let owner = await Owner.findOne({oId}).populate('friendList').select(['-cookies', '-_id']);

	if (!listById || !owner) return null;
	const Optimized = OptimizeHistory(listById);
	const remainingHistory = _.without(owner.friendList, Optimized);

	return {
		history: {
			changes: _.reduce(
				Optimized.changes,
				(sum, obj) => {
					return sum + obj.count;
				},
				0
			),
			list: Optimized,
			options: remainingHistory.map((l: IListDoc) => {
				return {
					lId: l.lId,
					createdAt: l.createdAt,
					updatedAt: l.updatedAt,
					changes: _.reduce(
						l.changes,
						(sum, obj) => {
							return sum + obj.count;
						},
						0
					)
				};
			}),
			previous: remainingHistory.length
		},
		owner: _.omit(owner.toObject(), ['friendList'])
	};
};

export const OptimizeHistory = (list: IListDoc): IListDoc => {
	let newList = list;
	for (const change of list.changes) {
		if (change.type === DifferenceType.Removed) {
			for (const removed of change.changes) {
				newList.friends.push(removed);
			}
		}
	}
	const Sorted = _.sortBy(newList.friends, 'status').reverse();
	newList.friends = Sorted;
	return newList;
};

export const getHistory = async (oId: string): Promise<IHistoryResult | undefined> => {
	try {
		let owner = await Owner.findOne({
			oId
		})
			.populate('friendList')
			.select(['-cookies', '-_id']);
		if (!owner) {
			return undefined;
		}
		let list: IListDoc = OptimizeHistory(_.last(owner.friendList, 1)[0]);

		return {
			history: {
				changes: _.reduce(
					list.changes,
					(sum, obj) => {
						return sum + obj.count;
					},
					0
				),
				list: list,
				previous: owner.friendList.length - 1,
				options: owner.friendList.map((l: IListDoc) => {
					return {
						lId: l.lId,
						createdAt: l.createdAt,
						updatedAt: l.updatedAt,
						changes: _.reduce(
							l.changes,
							(sum, obj) => {
								return sum + obj.count;
							},
							0
						)
					};
				})
			},
			owner: _.omit(owner.toObject(), ['friendList'])
		};
	} catch (error) {
		return undefined;
	}
};

export const fixUndefinedProfilePictures = async () => {
	let stats = {
		toBeFixed: 0,
		fixed: 0,
		failedToFix: 0,
		error: ''
	};
	try {
		const isActive = await schedule.getActiveJob('FIXER');
		if (isActive) {
			return;
		}
		const lists = await List.find({
			'friends.profilePicture': {
				$regex: /ui-avatars\.com/,
				$options: 'i'
			}
		});

		for (const list of lists) {
			const owner = await Owner.findOne({oId: list.oId});
			let isModified = false;
			const friends = list.friends;
			for (const friend of friends) {
				if (friend.profilePicture && friend.profilePicture.includes('ui-avatars.com')) {
					stats.toBeFixed++;
					const profilePicture = await FacebookService.getProfilePicture(friend.accountId, owner?.cookies!);
					if (profilePicture && !profilePicture?.url.includes('ui-avatars.com') && !profilePicture?.url.includes('.gif')) {
						stats.fixed++;
						friend.profilePicture = profilePicture?.url;
						isModified = true;
					} else {
						stats.failedToFix++;
					}
				}
			}
			if (isModified) {
				list.markModified('friends');
				await list.save();
			}
		}
		return stats;
	} catch (error) {
		console.error('Error occurred while fixing profile pictures:', error);
		throw error;
	}
};

async function processFriendRemoval(existingFriends: IFriend[], change: ListChanges, cookies: ICookie[]) {
	const removed = [];
	const remaining = [];

	for (const friend of existingFriends) {
		if (change.differenceArray.includes(friend.accountId)) {
			const pp = await FacebookService.getProfilePicture(friend.accountId, cookies, false);
			let status = 'removed';
			if (!pp || pp.url.includes('.gif')) {
				status = 'deactivated';
			}
			const modifiedFriend = {...friend, status};
			removed.push(modifiedFriend);
		} else {
			remaining.push(friend);
		}
	}

	return {removed, remaining};
}

async function processFriendAddition(friends: IFriend[], change: ListChanges, cookies: ICookie[]) {
	const added = friends.filter(friend => change.differenceArray.includes(friend.accountId));
	const newFriends = await createBulkFriends(added, cookies);
	return newFriends;
}

async function processFriendChanges(existingFriends: IFriend[], friends: IFriend[], changes: ListChanges[], cookies: ICookie[]) {
	const PushedChanges: ListDifference[] = [];

	for (const change of changes) {
		let removed: IFriend[] = [];
		let newFriends: IFriend[] = [];

		if (change.type === DifferenceType.Removed) {
			const {removed: removedFriends, remaining} = await processFriendRemoval(existingFriends, change, cookies);
			existingFriends = remaining;
			removed = removedFriends;
		}

		if (change.type === DifferenceType.New) {
			newFriends = await processFriendAddition(friends, change, cookies);
			existingFriends = existingFriends.concat(newFriends);
		}

		if (removed.length > 0) {
			PushedChanges.push({type: DifferenceType.Removed, count: removed.length, changes: removed});
		}
		if (newFriends.length > 0) {
			PushedChanges.push({type: DifferenceType.New, count: newFriends.length, changes: newFriends});
		}
	}

	return {existingFriends, PushedChanges};
}

export const Sync = async (latestList: IListDoc[], cookies: ICookie[], bId: string, oId: string, source: SyncSource, friends: IFriend[]): Promise<IListDoc | undefined> => {
	if (latestList.length === 0) {
		const newFriends = await createBulkFriends(friends, cookies);
		const newList = await createList(oId, bId, nanoid(), newFriends, source);

		await OwnerService.pushFriendListToOwner(oId, bId, newList._id, friends.length);
		return newList;
	}

	const latestFriendsIds = latestList[0].friends.map(f => f.accountId);
	const currentFriendsIds = friends.map(f => f.accountId);

	const changes = arr.isArrayModified(latestFriendsIds, currentFriendsIds);

	if (changes.length > 0) {
		let existingFriends: IFriend[] = latestList[0].friends.map(f => {
			if (f.status === 'new') f.status = '';
			return f;
		});

		const {existingFriends: updatedFriends, PushedChanges} = await processFriendChanges(existingFriends, friends, changes, cookies);
		const newList = await createList(oId, bId, nanoid(), updatedFriends, source, PushedChanges);

		await OwnerService.pushFriendListToOwner(oId, bId, newList._id, updatedFriends.length);
		return newList;
	}
	if (changes.length === 0) {
		schedule.startPatrol({friends, cookies, listId: latestList[0]._id, latestFriends: latestList[0].friends}, nanoid());
	}
};

export const AccountsByBrowserSession = async (browserId: string, current: string): Promise<Partial<IOwnerDoc>[]> => {
	const accounts = await Owner.find({browserId, oId: {$ne: current}})
		.select(['friendList', 'accountId', 'accountName', 'profilePic', 'oId', 'updatedAt'])
		.populate('friendList', ['lId'])
		.lean();
	return accounts;
};
export const CheckForNewPictures = async (friends: IFriend[], latestFriends: IFriend[], cookies: ICookie[], latestListId: ObjectId) => {
	const NewList = latestFriends;
	let changes =[]

	for (const friend of friends) {
		const hash = await CloudinaryService.getImageHash(friend.profilePicture);
		if (hash) {
			const saved = await FacebookService.findByAccountId(friend.accountId);
			if (saved) {
				const {per,similer} = await CloudinaryService.isSimilar(saved.hash, hash);
				if (!similer) {

					// TEMP: For Debugging purposes
					changes.push({
						accountId: friend.accountId,
						newHash: hash,
						oldHash: saved.hash,
						newProfile: friend.profilePicture,
						oldProfile: saved.cloud,
						per: per

					});
					const getFullProfile = await FacebookService.getProfilePicture(friend.accountId, cookies);
					if (getFullProfile) {
						NewList.find(f => f.accountId === friend.accountId)!.profilePicture = getFullProfile.url;
					}
				} else {
				}
			}
		}
	}
	if (changes.length > 0) {
		await List.findByIdAndUpdate(latestListId, {friends: NewList}, {new: true});
		return JSON.stringify(changes);
	}
	return `No changes found in the list with id ${latestListId}`;
};
