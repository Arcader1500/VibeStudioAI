import { Worker, Job } from 'bullmq';
import { connection } from '../lib/queue.js';
import { query } from '../lib/db.js';
import { DirectorAgent } from '@vibestudio/agent-director';
import { generateMechanics } from '@vibestudio/agent-mechanics';
import { generateAssets } from '@vibestudio/agent-asset';
import { generateAudio } from '@vibestudio/agent-audio';
import { assembleProject, runInstall, runBuild, startDevServer, uploadToCloud } from '@vibestudio/build-system';
import { runVerification } from '@vibestudio/runtime-verifier';
import { DebuggerAgent } from '@vibestudio/agent-debugger';
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

      // Build & Install
      await log('info', 'Installing dependencies');
      const installRes = runInstall(outputDir);
      if (!installRes.success) throw new Error('pnpm install failed: ' + installRes.stderr);

      await log('info', 'Building generated project');
      const buildRes = runBuild(outputDir);
      if (!buildRes.success) throw new Error('pnpm build failed: ' + buildRes.stderr);

      // Phase 4 & 5: Runtime Verification & Self-Healing loop
      await updatePhase('verification', 75);
      
      let verified = false;
      let retries = 0;
      const MAX_RETRIES = 3;
      const debuggerAgent = new DebuggerAgent();

      while (!verified && retries <= MAX_RETRIES) {
        await log('info', `Starting Dev Server for verification (Attempt ${retries + 1}/${MAX_RETRIES + 1})`);
        const port = 8080 + Math.floor(Math.random() * 1000); // randomize port to avoid conflicts
        const devServer = startDevServer(outputDir, port);
        
        // Wait a moment for server to boot
        await new Promise(r => setTimeout(r, 2000));

        await log('info', 'Running Playwright Telemetry Verification');
        const telemetry = await runVerification({ url: devServer.url });
        
        devServer.kill();

        if (!telemetry.success) {
          await log('error', `Verification failed with ${telemetry.errors.length} errors. First error: ${telemetry.errors[0].message}`);
          
          if (retries < MAX_RETRIES) {
            await log('info', 'Triggering Debugger Agent for Self-Healing...');
            const healResult = await debuggerAgent.heal(telemetry, outputDir);
            
            if (healResult.healed) {
              await log('info', `Debugger successfully applied patch: ${healResult.reason}`);
              // We must rebuild before the next verification iteration
              await log('info', 'Rebuilding patched project...');
              runBuild(outputDir);
            } else {
              await log('error', `Debugger failed to heal: ${healResult.reason}`);
              throw new Error(`Self-Healing failed: ${healResult.reason}`);
            }
          } else {
            throw new Error(`Runtime Verification failed after ${MAX_RETRIES} retries. Check logs.`);
          }
          retries++;
        } else {
          await log('info', `Verification passed! Screenshots and telemetry captured.`);
          verified = true;
        }
      }

      // Phase 7: Deployment
      await log('info', 'Deploying build to Cloud Storage...');
      const deployUrl = await uploadToCloud(path.join(outputDir, 'dist'));
      await log('info', `Game deployed successfully: ${deployUrl}`);

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
