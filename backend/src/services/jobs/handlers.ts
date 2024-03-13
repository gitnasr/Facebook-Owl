import { Job } from 'agenda';
import { LIST } from '@/types';
import { SyncService } from '..';

const JobHandlers = {
	Sync: async (job: Job<LIST.SyncJob>, done: Function) => {

		const {latestList, cookies, bId, oId, source, friends} = job.attrs.data;

		const refresh =  job.touch 
		
		await SyncService.Sync(latestList, cookies, bId, oId, source, friends,refresh);
		
		done();
	},
	Fixer: async (job: Job, done: Function) => {
		try {
			
			const refresh =  job.touch 
			await SyncService.fixUndefinedProfilePictures(refresh)
		} catch (error) {
			done(error);
		}
		
		done();
	},
};

export default JobHandlers;
