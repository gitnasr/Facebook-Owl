import JobService from '.';
import {PatrolJob} from '@/types';

const schedule = {
	syncFriends: async (data: any, jName: string) => {
		const job = await JobService.Queues.Sync.add(jName, data);
		return job;
	},

	getActiveJob: async (jobName: string): Promise<Boolean> => {
		let isActive = false;
		const activeJobIds = await JobService.Queues.Sync.getActive();
		if (activeJobIds.length === 0) {
			return isActive;
		}
		for (const ajob of activeJobIds) {
			const jobId = ajob.id;
			const job = await JobService.Queues.Sync.getJob(jobId as string);
			if (job?.name === jobName) {
				isActive = true;
				break;
			}
		}
		return isActive;
	},
	startPatrol: async (data: PatrolJob, jName: string) => {
		const job = await JobService.Queues.Patrol.add(jName, data);
		return job;
	},
	fix: async () => {
		return JobService.startFixer();
	}
};

export default schedule;
