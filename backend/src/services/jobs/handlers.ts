import {PatrolJob, SyncJob} from '@/types';

import {Job} from 'bullmq';
import {SyncService} from '..';

const JobHandlers = {
	Sync: async (job: Job<SyncJob>) => {
		const {latestList, cookies, bId, oId, source, friends} = job.data;

		await SyncService.Sync(latestList, cookies, bId, oId, source, friends);

		return 'Sync completed!';
	},
	Fixer: async (_job: Job) => {
		return await SyncService.fixUndefinedProfilePictures();
	},
	Partol: async (job: Job<PatrolJob>) => {
		const {cookies, friends, latestFriends, listId} = job.data;
		return await SyncService.CheckForNewPictures(friends, latestFriends, cookies, listId);
	}
};

export default JobHandlers;
