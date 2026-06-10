/**
 * Project Routes — REST API
 * SRS §9 API Specification
 *
 * POST   /projects              → Create project (FR-1, FR-8)
 * GET    /projects/:id          → Get project state
 * GET    /projects/:id/logs     → Get execution logs
 * GET    /projects/:id/download → Download source package (FR-12)
 */
import { type FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// ---------------------------------------------------------------------------
// Request/Response schemas (Zod → Fastify validation)
// ---------------------------------------------------------------------------

const CreateProjectBody = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
});

import { query } from '../lib/db.js';
import { projectQueue } from '../lib/queue.js';

// ---------------------------------------------------------------------------
// Route plugin
// ---------------------------------------------------------------------------

export async function projectRoutes(app: FastifyInstance) {
  /**
   * POST /projects
   * SRS FR-1: Accept a natural language game description
   * SRS §9: Returns projectId
   */
  app.post('/', async (request, reply) => {
    const result = CreateProjectBody.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.flatten() });
    }

    const projectId = randomUUID();
    const aiProvider = request.headers['x-ai-provider'] || 'auto';
    const aiKey = request.headers['x-openrouter-key'] || '';

    await query(
      'INSERT INTO projects (id, prompt, status) VALUES ($1, $2, $3)',
      [projectId, result.data.prompt, 'pending']
    );

    await projectQueue.add('build', { 
      projectId, 
      prompt: result.data.prompt,
      aiProvider,
      aiKey
    });

    app.log.info({ projectId }, 'Project created and enqueued');

    return reply.status(201).send({ projectId });
  });

  /**
   * GET /projects/:id
   * Returns project state + build status
   */
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const res = await query('SELECT * FROM projects WHERE id = $1', [id]);
    if (res.rowCount === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }
    const project = res.rows[0];

    return reply.send({
      project,
      buildStatus: {
        projectId: id,
        phase: project.status,
        progress: 0,
        updatedAt: project.updated_at,
      },
    });
  });

  /**
   * GET /projects/:id/logs
   * Returns execution logs for the project
   */
  app.get('/:id/logs', async (request, reply) => {
    const { id } = request.params as { id: string };

    const res = await query('SELECT * FROM projects WHERE id = $1', [id]);
    if (res.rowCount === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    const logsRes = await query('SELECT output FROM agent_runs WHERE project_id = $1 ORDER BY created_at ASC', [id]);
    const logs = logsRes.rows.map(row => JSON.parse(row.output));

    return reply.send({
      projectId: id,
      logs,
    });
  });

  /**
   * GET /projects/:id/download
   * Downloads generated source code package (FR-12)
   */
  app.get('/:id/download', async (request, reply) => {
    const { id } = request.params as { id: string };
    const res = await query('SELECT status FROM projects WHERE id = $1', [id]);
    if (res.rowCount === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }
    
    const status = res.rows[0].status;

    if (status !== 'completed') {
      return reply.status(409).send({
        error: 'Project is not yet completed',
        status,
      });
    }

    // TODO (1F.6): Serve generated zip from build system
    return reply.status(501).send({ error: 'Download not yet implemented' });
  });
}
