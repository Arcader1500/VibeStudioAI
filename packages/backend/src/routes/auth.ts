import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/db.js';
import crypto from 'crypto';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authRoutes: FastifyPluginAsync = async (app) => {
  // Register (mock hashing)
  app.post('/register', async (request, reply) => {
    try {
      const { email, password } = AuthSchema.parse(request.body);
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      
      const res = await query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
        [email, hash]
      );
      
      // Return a dummy token consisting of just the user ID for this MVP
      const userId = res.rows[0].id;
      return { token: userId, userId };
    } catch (e) {
      reply.status(400).send({ error: e instanceof Error ? e.message : 'Invalid request' });
    }
  });

  // Login (mock check)
  app.post('/login', async (request, reply) => {
    try {
      const { email, password } = AuthSchema.parse(request.body);
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      
      const res = await query('SELECT id FROM users WHERE email = $1 AND password = $2', [email, hash]);
      
      if (res.rows.length === 0) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }
      
      return { token: res.rows[0].id, userId: res.rows[0].id };
    } catch (e) {
      reply.status(400).send({ error: 'Invalid request' });
    }
  });
};
