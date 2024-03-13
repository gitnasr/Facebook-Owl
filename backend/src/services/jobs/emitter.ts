import JobHandlers from './handlers';
import agenda from '.';

const schedule = {
	syncFriends: async (data: any, jName: string) => {
		agenda.define(jName, JobHandlers.Sync);
		await agenda.now(jName, data);
	},
	getActiveJob: async (jobName: string) => {
		return await agenda.jobs({name: jobName, lockedAt: {$ne:null}});
	},
	automatedFixer: async () => {
		agenda.define('fixer', JobHandlers.Fixer);
		await agenda.every('1 hour', 'fixer');
	}
};

export default schedule;
