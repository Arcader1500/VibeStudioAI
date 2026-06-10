/**
 * BullMQ Job Queue setup
 */
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const projectQueue = new Queue('projects', { connection });

// We define the worker elsewhere, but we export the connection for it
export { connection };
