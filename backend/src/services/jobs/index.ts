import {Queue, Worker, WorkerOptions} from 'bullmq';

import {CronTime} from 'cron-time-generator';
import JobHandlers from './handlers';
import RedisService from '@/services/redis';

class JobService {
	workers:
		| {
				[key: string]: Worker;
		  }
		| undefined;
	defaultOptions: WorkerOptions;
	Queues: Record<string, Queue> = {};
	constructor() {
		this.defaultOptions = {
			connection: RedisService.connection,
			removeOnComplete: {
				count: 2
			},
			concurrency: 1
		};
		this.defineWorkers();
		this.defineQueue();
	}
	private defineWorkers() {
		this.workers = {
			Syncer: new Worker('Syncer', JobHandlers.Sync, {
				...this.defaultOptions,
				concurrency: 5,
				removeOnComplete: {
					count: 5
				}
			}),
			Fixer: new Worker('Fixer', JobHandlers.Fixer, this.defaultOptions),
			Patrol: new Worker('Patrol', JobHandlers.Partol, this.defaultOptions)
		};
	}
	defineQueue() {
		for (const key in this.workers) {
			this.Queues[key] = new Queue(key, {connection: RedisService.connection});
		}
	}
	startFixer() {
		this.Queues.Fixer.add(
			'Fixer',
			{},
			{
				repeat: {
					pattern: CronTime.everyDayAt(0, 0),
					jobId: 'Fixer'
				}
			}
		);
	}
}

export default new JobService();
