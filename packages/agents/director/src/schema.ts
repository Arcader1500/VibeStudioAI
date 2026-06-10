/**
 * Director Agent — Blueprint Schema (Zod)
 * Implements SRS FR-3: Blueprint Generation
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Sub-schemas
// ---------------------------------------------------------------------------

export const GameplaySpecSchema = z.object({
  genre: z.string().min(1),
  camera: z.enum(['top_down', 'side_scroller', 'isometric', 'fixed']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  winConditions: z.array(z.string()).min(1),
  lossConditions: z.array(z.string()).min(1),
  waveBased: z.boolean().optional(),
  playerLives: z.number().int().positive().optional(),
});

export const AudioSpecSchema = z.object({
  hasBackgroundMusic: z.boolean(),
  hasSoundEffects: z.boolean(),
  hasAmbientSound: z.boolean(),
  musicStyle: z.string().optional(),
});

export const ControlSpecSchema = z.object({
  keyboard: z.boolean(),
  gamepad: z.boolean(),
  touch: z.boolean(),
  primaryControls: z.object({
    move: z.string().optional(),
    action: z.string().optional(),
    pause: z.string().optional(),
  }),
});

export const DeploymentSpecSchema = z.object({
  targetUrl: z.string().url().optional(),
  exportFormats: z.array(z.enum(['zip', 'blueprint', 'assets'])),
});

export const ProjectBlueprintSchema = z.object({
  title: z.string().min(1).max(100),
  genre: z.string().min(1),
  artStyle: z.enum(['pixel', 'vector', 'hand_drawn', 'minimal']),
  gameplay: GameplaySpecSchema,
  audio: AudioSpecSchema,
  controls: ControlSpecSchema,
  deployment: DeploymentSpecSchema,
});

export type ProjectBlueprint = z.infer<typeof ProjectBlueprintSchema>;

// ---------------------------------------------------------------------------
// Clarification question types (FR-2)
// ---------------------------------------------------------------------------

export interface ClarificationQuestion {
  id: string;
  question: string;
  options?: string[];          // optional multiple-choice
  required: boolean;
}

export interface ClarificationSession {
  projectId: string;
  originalPrompt: string;
  questions: ClarificationQuestion[];
  answers: Record<string, string>;
  complete: boolean;
}
