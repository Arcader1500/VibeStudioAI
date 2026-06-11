/**
 * BullMQ Job Queue setup
 */
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

export const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const projectQueue = new Queue('projects', { connection: connectionOptions });
