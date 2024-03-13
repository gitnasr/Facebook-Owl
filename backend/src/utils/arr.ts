import {LIST} from '@/types';
import _ from 'underscore';

export const isArrayModified = (oldFriendsIds: number[], currentFriendsIds: number[]): LIST.ListChanges[] => {
	const added = _.difference(currentFriendsIds, oldFriendsIds);
	const removed = _.difference(oldFriendsIds, currentFriendsIds);

	const changes: LIST.ListChanges[] = [];

	if (added.length > 0) {
		changes.push({
			type: LIST.DifferenceType.New,
			differenceArray: added
		});
	}
	if (removed.length > 0) {
		changes.push({
			type: LIST.DifferenceType.Removed,
			differenceArray: removed
		});
	}

	return changes;
};
