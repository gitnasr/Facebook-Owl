import {Job} from 'bullmq';
import {SyncJob} from '@/types';
import {SyncService} from '..';

const JobHandlers = {
	Sync: async (job: Job<SyncJob>) => {
		const {latestList, cookies, bId, oId, source, friends} = job.data;

		await SyncService.Sync(latestList, cookies, bId, oId, source, friends);

		return 'Sync completed!';
	},
	Fixer: async (_job: Job) => {
		return await SyncService.fixUndefinedProfilePictures();
	}
};

export default JobHandlers;
