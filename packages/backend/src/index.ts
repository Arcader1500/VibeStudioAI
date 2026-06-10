/**
 * VibeStudio AI — Backend Orchestration Server
 * Technology: Fastify + TypeScript
 * SRS §4.B, §9 API Specification
 */
import Fastify from 'fastify';
import { projectRoutes } from './routes/projects.js';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
server.get('/health', async () => ({ status: 'ok', version: '0.1.0' }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
await server.register(projectRoutes, { prefix: '/projects' });

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';

try {
  await server.listen({ port: PORT, host: HOST });
  server.log.info(`VibeStudio AI Backend listening on http://${HOST}:${PORT}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
