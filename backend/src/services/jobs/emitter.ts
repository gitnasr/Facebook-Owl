import {PatrolQ, SyncQ} from '.';

import {PatrolJob} from '@/types';

const schedule = {
	syncFriends: async (data: any, jName: string) => {
		const job = await SyncQ.add(jName, data);
		return job;
	},

	getActiveJob: async (jobName: string): Promise<Boolean> => {
		let isActive = false;
		const activeJobIds = await SyncQ.getActive();
		if (activeJobIds.length === 0) {
			return isActive;
		}
		for (const ajob of activeJobIds) {
			const jobId = ajob.id;
			const job = await SyncQ.getJob(jobId as string);
			if (job?.name === jobName) {
				isActive = true;
				break;
			}
		}
		return isActive;
	},
	startPatrol: async (data: PatrolJob, jName: string) => {
		const job = await PatrolQ.add(jName, data);
		return job;
	}
};

export default schedule;
