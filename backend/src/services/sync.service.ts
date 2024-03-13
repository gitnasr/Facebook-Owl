import { FRIEND, LIST } from '@/types';
import { FacebookService, OwnerService } from '.';
import { List, Owner } from '@/models';

import { ICookie } from '@/types/u.types';
import _ from 'underscore';
import { arr } from '@/utils';
import moment from 'moment';
import { nanoid } from 'nanoid';
import schedule from './jobs/emitter';

export const getLatestByOwnerIdAndBrowser = (ownerId: string, browserId: string, limit: number = 1): LIST.IListFind => {
	return List.find({oId: ownerId, bId: browserId}).sort({createdAt: -1}).limit(limit);
};

export const createBulkFriends = async (friends: FRIEND.IFriend[], cookies: ICookie[]): Promise<FRIEND.IFriend[]> => {
	const Friends: FRIEND.IFriend[] = [];
	const addedOn = moment().toDate();
	for (const friend of friends) {
		const fId = nanoid(6);
		let profilePicture = await FacebookService.getProfilePicture(friend.accountId, cookies);
		if (typeof profilePicture === 'undefined') {
			profilePicture = {
				url: `https:ui-avatars.com/api/?name=${friend.fullName}&background=random&size=200&rounded=true&color=fff&bold=true`,
				id: '',
				hash: ''
			};
		}
		const modifiedFriend: FRIEND.IFriend = {
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
export const createList = (ownerId: string, browserId: string, lId: string, friends: FRIEND.IFriend[], source: LIST.SyncSource, difference?: LIST.ListDifference[]) => {
	return List.create({
		bId: browserId,
		oId: ownerId,
		lId,
		friends,
		changes: difference,
		source
	});
};

export const getListById = async (lId: string, oId: string): LIST.IListById => {
	const listById = await List.findOne({lId}).where({oId});
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
			isGold: true,
			list: Optimized,
			options: remainingHistory.map((l: LIST.IListDoc) => {
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

export const OptimizeHistory = (list: LIST.IListDoc): LIST.IListDoc => {
	let newList = list;
	for (const change of list.changes) {
		if (change.type === LIST.DifferenceType.Removed) {
			for (const removed of change.changes) {
				newList.friends.push(removed);
			}
		}
	}

	newList.friends = _.sortBy(newList.friends, 'status');

	return newList;
};

export const getHistory = async (oId: string, isGold: boolean = false): Promise<LIST.IHistoryResult | undefined> => {
	try {
		let owner = await Owner.findOne({
			oId
		})
			.populate('friendList')
			.select(['-cookies', '-_id']);
		if (!owner) {
			return undefined;
		}
		let list: LIST.IListDoc = OptimizeHistory(_.last(owner.friendList, 1)[0]);
		const remainingHistory = _.without(owner.friendList, list);

		return {
			history: {
				changes: _.reduce(
					list.changes,
					(sum, obj) => {
						return sum + obj.count;
					},
					0
				),
				isGold,
				list: list,
				previous: owner.friendList.length - 1,
				options: owner.friendList.map((l: LIST.IListDoc) => {
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

export const fixUndefinedProfilePictures = async (refresh: Function) => {
	try {
		// Check if the job is running
		const isActive = await schedule.getActiveJob('fixer');
		if (isActive.length > 0) {
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
				refresh()
				if (friend.profilePicture && friend.profilePicture.includes('ui-avatars.com')) {
					const profilePicture = await FacebookService.getProfilePicture(friend.accountId, owner?.cookies!);
					if (profilePicture && !profilePicture?.url.includes('ui-avatars.com') && !profilePicture?.url.includes('.gif')) {
						friend.profilePicture = profilePicture?.url;
						isModified = true;
					} else {
						console.log('Skipping profile picture for', friend.accountId, 'as it is not available');
					}
				}
			}
			if (isModified) {
				list.markModified('friends');
				await list.save();
			}
		}
	} catch (error) {
		console.error('Error occurred while fixing profile pictures:', error);
		throw error;
	}
};

export const Sync = async (latestList: LIST.IListDoc[], cookies: ICookie[], bId: string, oId: string, source: LIST.SyncSource, friends: FRIEND.IFriend[] ,refresh: Function): Promise<LIST.IListDoc | undefined> => {
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
		let existingFriends: FRIEND.IFriend[] = latestList[0].friends.map(f => {
			if (f.status === 'new') f.status = '';
			return f;
		});

		const PushedChanges: LIST.ListDifference[] = [];
		for (const change of changes) {
			refresh()
			if (change.type === LIST.DifferenceType.Removed) {
				const {removed, remaining} = await existingFriends.reduce(
					async (accPromise: LIST.IAccountPromised, friend: FRIEND.IFriend) => {
						const {removed, remaining} = await accPromise;
						if (change.differenceArray.includes(friend.accountId)) {
							const pp = await FacebookService.getProfilePicture(friend.accountId, cookies, false);
							let status = 'removed';
							if (!pp || pp.url.includes('.gif')) {
								status = 'deactivated';
							}
							const modifiedFriend: FRIEND.IFriend = {
								...friend,
								status
							};
							removed.push(modifiedFriend);
						} else {
							remaining.push(friend);
						}
						return {
							removed,
							remaining
						};
					},
					Promise.resolve({
						removed: [],
						remaining: []
					})
				);

				existingFriends = remaining;
				PushedChanges.push({
					type: LIST.DifferenceType.Removed,
					count: removed.length,
					changes: removed
				});
			}

			if (change.type === LIST.DifferenceType.New) {
				const added = friends.filter(f => change.differenceArray.includes(f.accountId));
				const newFriends = await createBulkFriends(added, cookies);

				existingFriends = existingFriends.concat(newFriends);
				PushedChanges.push({
					type: LIST.DifferenceType.New,
					count: newFriends.length,
					changes: newFriends
				});
			}
		}

		const newList = await createList(oId, bId, nanoid(), existingFriends, source, PushedChanges);

		await OwnerService.pushFriendListToOwner(oId, bId, newList._id, existingFriends.length);
		return newList;
	}
	
};
