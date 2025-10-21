import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_SERVER || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } else {
    console.log('⚠️ Redis sudah terkoneksi, skip connect ulang.');
  }
};

export { redisClient };
