import {Queue, Worker, WorkerOptions} from 'bullmq';

import {CronTime} from 'cron-time-generator';
import JobHandlers from './handlers';
import RedisService from '@/services/redis';
import moment from 'moment';

class JobService {
	workers: { [key: string]: Worker } | undefined; // Ensures workers is an object with string keys or undefined

	defaultOptions: WorkerOptions;
	Queues: Record<string, Queue> = {}; // Uses keyof with 'this.workers' for type safety
	constructor() {
		this.defaultOptions = {
			connection: RedisService.connection,
			removeOnComplete: {
				count: 2,
				age: moment.duration(1, "hour").asSeconds()
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
