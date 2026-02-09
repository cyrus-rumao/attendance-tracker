import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// resolve .env path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.REDIS_URL) {
	throw new Error('REDIS_URL is missing in environment variables');
}

export const redis = new Redis(process.env.REDIS_URL, {
	tls: {}, // REQUIRED for Upstash
	maxRetriesPerRequest: null,
});

// proper connection logs
redis.on('connect', () => {
	console.log('✅ Redis connected');
});

redis.on('error', (err) => {
	console.error('❌ Redis error:', err.message);
});
