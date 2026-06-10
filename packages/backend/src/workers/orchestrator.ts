import { Worker, Job } from 'bullmq';
import { connection } from '../lib/queue.js';
import { query } from '../lib/db.js';
import { DirectorAgent } from '@vibestudio/agents-director';
import { generateMechanics } from '@vibestudio/agents-mechanics';
import { generateAssets } from '@vibestudio/agents-asset';
import { generateAudio } from '@vibestudio/agents-audio';
import { assembleProject } from '@vibestudio/build-system';
import path from 'path';

export const orchestratorWorker = new Worker(
  'projects',
  async (job: Job) => {
    const { projectId, prompt } = job.data;
    
    const log = async (level: string, message: string) => {
      await query(
        'INSERT INTO agent_runs (project_id, agent_type, status, output) VALUES ($1, $2, $3, $4)',
        [projectId, 'orchestrator', 'running', JSON.stringify({ level, message, timestamp: new Date().toISOString() })]
      );
    };

    const updatePhase = async (phase: string, progress: number) => {
      await query(
        'UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2',
        [phase, projectId]
      );
      // In a real app we would push this over WebSocket here
    };

    try {
      await log('info', 'Starting build process');
      await updatePhase('director', 10);

      // Phase 1D: Director Agent
      await log('info', 'Running Director Agent');
      const director = new DirectorAgent();
      const isAmbiguous = director.detectAmbiguity(prompt);
      
      let blueprint;
      if (isAmbiguous) {
        // We simulate that clarification was already done by the frontend and passed in,
        // or for this automated worker we just force generation.
        blueprint = director.generateBlueprint(prompt, { difficulty: 'Medium' });
      } else {
        blueprint = director.generateBlueprint(prompt);
      }

      await query(
        'UPDATE projects SET blueprint = $1 WHERE id = $2',
        [JSON.stringify(blueprint), projectId]
      );

      // Phase 1E: Mechanics Agent
      await updatePhase('generation', 35);
      await log('info', 'Running Mechanics Agent');
      const mechanics = generateMechanics(blueprint);

      // Phase 2: Asset Agent
      await log('info', 'Running Asset Agent');
      const assets = generateAssets(blueprint);

      // Phase 3: Audio Agent
      await log('info', 'Running Audio Agent');
      const audio = generateAudio(blueprint);

      // Phase 1F: Build System (Assembly)
      await updatePhase('assembly', 60);
      await log('info', 'Assembling Project');
      
      // Output directory for the generated project
      // For simplicity, we output to a 'generated' folder in the workspace root
      const outputDir = path.resolve(process.cwd(), '../../generated', projectId);
      
      assembleProject({
        outputDir,
        blueprint,
        mechanics,
        assetsCode: assets.assetsCode,
        audioCode: audio.audioCode,
      });

      // Complete
      await updatePhase('completed', 100);
      await log('info', 'Build completed successfully');

    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      await log('error', msg);
      await updatePhase('failed', 100);
      throw error;
    }
  },
  { connection }
);

orchestratorWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
