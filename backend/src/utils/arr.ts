import {DifferenceType, ListChanges} from '@/types';

import _ from 'underscore';

export const isArrayModified = (oldFriendsIds: number[], currentFriendsIds: number[]): ListChanges[] => {
	const added = _.difference(currentFriendsIds, oldFriendsIds);
	const removed = _.difference(oldFriendsIds, currentFriendsIds);

	const changes: ListChanges[] = [];

	if (added.length > 0) {
		changes.push({
			type: DifferenceType.New,
			differenceArray: added
		});
	}
	if (removed.length > 0) {
		changes.push({
			type: DifferenceType.Removed,
			differenceArray: removed
		});
	}

	return changes;
};
