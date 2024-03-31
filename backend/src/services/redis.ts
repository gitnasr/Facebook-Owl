import {Redis} from 'ioredis';
import {config} from '@/config';

class RedisService {
	url: string;
	maxRetriesPerRequest: null;
	redis: Redis;
	constructor() {
		this.url = config.redis.url;
		this.maxRetriesPerRequest = null;
		this.redis = new Redis(this.url, {maxRetriesPerRequest: this.maxRetriesPerRequest});
	}
	get connection() {
		return this.redis;
	}
}

export default new RedisService();
