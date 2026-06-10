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

// In-memory project store (replace with PostgreSQL in 1C.9)
const projects = new Map<string, Record<string, unknown>>();

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
    const project = {
      id: projectId,
      prompt: result.data.prompt,
      status: 'pending',
      blueprint: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.set(projectId, project);

    // TODO (1C.8): Enqueue to BullMQ job queue → trigger Director Agent
    app.log.info({ projectId }, 'Project created');

    return reply.status(201).send({ projectId });
  });

  /**
   * GET /projects/:id
   * Returns project state + build status
   */
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = projects.get(id);

    if (!project) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    return reply.send({
      project,
      buildStatus: {
        projectId: id,
        phase: project.status,
        progress: 0,
        updatedAt: project['updatedAt'],
      },
    });
  });

  /**
   * GET /projects/:id/logs
   * Returns execution logs for the project
   */
  app.get('/:id/logs', async (request, reply) => {
    const { id } = request.params as { id: string };

    if (!projects.has(id)) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    // TODO (1C.7): Stream logs from BullMQ / PostgreSQL
    return reply.send({
      projectId: id,
      logs: [],
    });
  });

  /**
   * GET /projects/:id/download
   * Downloads generated source code package (FR-12)
   */
  app.get('/:id/download', async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = projects.get(id);

    if (!project) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    if (project['status'] !== 'completed') {
      return reply.status(409).send({
        error: 'Project is not yet completed',
        status: project['status'],
      });
    }

    // TODO (1F.6): Serve generated zip from build system
    return reply.status(501).send({ error: 'Download not yet implemented' });
  });
}
