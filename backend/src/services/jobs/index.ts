import {Queue, Worker} from 'bullmq';

import {CronTime} from 'cron-time-generator';
import JobHandlers from './handlers';
import {Redis} from 'ioredis';
import {config} from '@/config';
import moment from 'moment';

const RedisService = new Redis(config.redis.url, {maxRetriesPerRequest: null});
const SyncQ = new Queue('Syncer', {connection: RedisService});
const worker = new Worker('Syncer', JobHandlers.Sync, {
	connection: RedisService,
	concurrency: 5,
	removeOnComplete: {
		age: moment.duration(1, 'hour').asMilliseconds(),
		count: 4
	}
});

worker.on('completed', job => {
	const doneat = moment().format('YYYY-MM-DD HH:mm:ss');

	console.log(`Job ${job.name} has been completed`, doneat);
});

worker.on('ready', () => {
	console.log('Worker is ready');
});
worker.on('active', job => {
	const activeAt = moment().format('YYYY-MM-DD HH:mm:ss');

	console.log(`Job ${job.name} is active`, activeAt);
});
const FixerQ = new Queue('Fixer', {connection: RedisService});
const Fixer = new Worker('Fixer', JobHandlers.Fixer, {
	connection: RedisService,
	concurrency: 1,
	removeOnComplete: {
		age: moment.duration(1, 'hour').asMilliseconds(),
		count: 4
	}
});
FixerQ.add(
	'Fixer',
	{},
	{
		repeat: {
			pattern: CronTime.every(1).hours()
		},
		jobId: 'Fixer'
	}
);
export {RedisService, SyncQ, worker};
