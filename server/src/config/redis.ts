import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
	throw new Error('❌ REDIS_URL is missing at runtime');
}

export const redis = new Redis(redisUrl, {
	tls: {}, // required for Upstash
	maxRetriesPerRequest: null,
});

redis.on('connect', () => {
	console.log('✅ Redis connected');
});

redis.on('error', (err: Error) => {
	console.error('❌ Redis error:', err.message);
});
