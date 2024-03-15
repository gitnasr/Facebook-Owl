import {SyncQ} from '.';

const schedule = {
	syncFriends: async (data: any, jName: string) => {
		const job = await SyncQ.add(jName, data);
		return job;
	},

	getActiveJob: async (jobName: string): Promise<Boolean> => {
		let isActive = false;
		const activeJobIds = await SyncQ.getActive();
		if (activeJobIds.length === 0) {
			console.log('No active jobs');
			return isActive;
		}
		for (const ajob of activeJobIds) {
			const jobId = ajob.id;
			const job = await SyncQ.getJob(jobId as string);
			if (job?.name === jobName) {
				console.log(`Job ${jobName} is active. Skipping...`)
				isActive = true;
				break;
			}
		}
		return isActive;
	}
};

export default schedule;
