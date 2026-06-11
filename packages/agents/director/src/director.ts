/**
 * Director Agent — Core Logic
 * Implements SRS FR-2 (Interactive Clarification) and FR-3 (Blueprint Generation)
 *
 * Responsibilities:
 *   1. Detect ambiguity in user prompt
 *   2. Generate clarification questions
 *   3. Accept answers
 *   4. Produce validated ProjectBlueprint JSON
 */

import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
  type ClarificationQuestion,
  type ClarificationSession,
} from './schema.js';
import { AIRouter } from '@vibestudio/shared/src/ai/router.js';

// ---------------------------------------------------------------------------
// Ambiguity detection (FR-2)
// ---------------------------------------------------------------------------

const AMBIGUOUS_KEYWORDS: Record<string, string[]> = {
  genre: ['game', 'play'],                           // needs genre clarification
  camera: ['view', 'perspective', 'angle'],
  artStyle: ['look', 'style', 'graphic', 'art'],
  difficulty: ['hard', 'easy', 'challenge', 'casual'],
};

/**
 * Returns a list of aspects of the prompt that are ambiguous.
 */
export function detectAmbiguity(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const ambiguous: string[] = [];

  // Genre — check if a known genre word is present
  const genreKeywords = [
    'platformer', 'shooter', 'survival', 'puzzle', 'rpg',
    'racing', 'tower defense', 'rogue', 'adventure', 'arcade',
  ];
  if (!genreKeywords.some((g) => lower.includes(g))) {
    ambiguous.push('genre');
  }

  // Art style
  const artKeywords = ['pixel', 'vector', 'hand drawn', 'minimal'];
  if (!artKeywords.some((a) => lower.includes(a))) {
    ambiguous.push('artStyle');
  }

  // Camera perspective
  const cameraKeywords = ['top down', 'top-down', 'side scroller', 'side-scroller', 'isometric'];
  if (!cameraKeywords.some((c) => lower.includes(c))) {
    ambiguous.push('camera');
  }

  // Difficulty
  const difficultyKeywords = ['easy', 'medium', 'hard', 'normal', 'casual', 'challenging'];
  if (!difficultyKeywords.some((d) => lower.includes(d))) {
    ambiguous.push('difficulty');
  }

  return ambiguous;
}

// ---------------------------------------------------------------------------
// Question generation (FR-2)
// ---------------------------------------------------------------------------

const QUESTION_BANK: Record<string, ClarificationQuestion> = {
  genre: {
    id: 'genre',
    question: 'What genre is your game?',
    options: ['Platformer', 'Top-down Shooter', 'Survival', 'Puzzle', 'RPG', 'Tower Defense', 'Arcade', 'Racing'],
    required: true,
  },
  artStyle: {
    id: 'artStyle',
    question: 'What art style should the game use?',
    options: ['Pixel Art', 'Vector / Flat', 'Hand Drawn', 'Minimal / Geometric'],
    required: true,
  },
  camera: {
    id: 'camera',
    question: 'What camera perspective?',
    options: ['Top-Down (bird\'s eye)', 'Side Scroller', 'Isometric', 'Fixed Camera'],
    required: true,
  },
  difficulty: {
    id: 'difficulty',
    question: 'What difficulty level?',
    options: ['Easy', 'Medium', 'Hard'],
    required: false,
  },
  singleMultiplayer: {
    id: 'singleMultiplayer',
    question: 'Single-player or multiplayer?',
    options: ['Single-Player', 'Multiplayer (not supported in v1)'],
    required: false,
  },
};

/**
 * Generates clarification questions for all ambiguous aspects. (FR-2)
 */
export function generateClarificationQuestions(
  ambiguousAspects: string[],
): ClarificationQuestion[] {
  return ambiguousAspects
    .map((aspect) => QUESTION_BANK[aspect])
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Blueprint generation (FR-3)
// ---------------------------------------------------------------------------

/**
 * Maps raw prompt + clarification answers → validated ProjectBlueprint.
 * In production, this will be backed by an LLM call via Antigravity SDK.
 * This stub provides deterministic defaults for MVP testing.
 */
export async function generateBlueprint(
  session: ClarificationSession,
  aiRouter?: AIRouter,
  aiProvider?: 'auto' | 'gemini' | 'claude' | 'gpt' | 'deepseek'
): Promise<ProjectBlueprint> {
  const { originalPrompt, answers } = session;

  if (aiRouter) {
    const systemPrompt = `You are the VibeStudio AI Director. Your task is to generate a structured JSON blueprint for a 2D Phaser game.
The user has provided a base prompt and some clarification answers.
You must return a raw JSON object that EXACTLY matches the following schema.
Do NOT wrap the JSON in markdown or backticks.

{
  "title": "String (Short, catchy game title)",
  "genre": "String (e.g. 'arcade', 'survival', 'platformer', 'rpg', 'tower_defense', 'puzzle')",
  "artStyle": "String (Must be one of: 'pixel', 'vector', 'hand_drawn', 'minimal')",
  "gameplay": {
    "genre": "String (same as above)",
    "camera": "String (Must be one of: 'top_down', 'side_scroller', 'isometric', 'fixed')",
    "difficulty": "String (Must be one of: 'easy', 'medium', 'hard')",
    "winConditions": ["String", "String"],
    "lossConditions": ["String", "String"],
    "waveBased": true/false,
    "playerLives": number
  },
  "audio": {
    "hasBackgroundMusic": true/false,
    "hasSoundEffects": true/false,
    "hasAmbientSound": true/false,
    "musicStyle": "String"
  },
  "controls": {
    "keyboard": true/false,
    "gamepad": true/false,
    "touch": true/false,
    "primaryControls": {
      "move": "String (e.g. 'WASD')",
      "action": "String (e.g. 'Space')",
      "pause": "String (e.g. 'Escape')"
    }
  },
  "deployment": {
    "exportFormats": ["zip"]
  }
}

Use sensible defaults for anything not explicitly specified.`;

    const userPrompt = `Prompt: ${originalPrompt}
Clarification Answers: ${JSON.stringify(answers)}`;

    try {
      const response = await aiRouter.generate(`${systemPrompt}\n\n${userPrompt}`, { jsonMode: true, model: aiProvider });
      const rawData = JSON.parse(response.content);
      return ProjectBlueprintSchema.parse(rawData);
    } catch (e) {
      console.warn('AI generation failed or returned invalid schema. Falling back to deterministic generation.', e);
    }
  }

  const lower = originalPrompt.toLowerCase();

  // --- genre ---
  let genre = answers['genre'] ?? 'arcade';
  genre = genre.toLowerCase().replace(/ /g, '_');

  // --- art style ---
  const rawArt = (answers['artStyle'] ?? 'Pixel Art').toLowerCase();
  const artStyle = rawArt.includes('pixel')
    ? 'pixel'
    : rawArt.includes('vector') || rawArt.includes('flat')
    ? 'vector'
    : rawArt.includes('hand')
    ? 'hand_drawn'
    : 'minimal';

  // --- camera ---
  const rawCamera = (answers['camera'] ?? 'Top-Down (bird\'s eye)').toLowerCase();
  const camera =
    rawCamera.includes('top') ? 'top_down' :
    rawCamera.includes('side') ? 'side_scroller' :
    rawCamera.includes('iso') ? 'isometric' :
    'fixed';

  // --- difficulty ---
  const rawDiff = (answers['difficulty'] ?? 'Medium').toLowerCase();
  const difficulty: 'easy' | 'medium' | 'hard' =
    rawDiff === 'easy' ? 'easy' : rawDiff === 'hard' ? 'hard' : 'medium';

  const blueprint: ProjectBlueprint = {
    title: deriveTitle(originalPrompt),
    genre,
    artStyle,
    gameplay: {
      genre,
      camera,
      difficulty,
      winConditions: deriveWinConditions(lower, genre),
      lossConditions: ['Player health reaches 0', 'Time limit exceeded'],
      waveBased: lower.includes('wave'),
      playerLives: 3,
    },
    audio: {
      hasBackgroundMusic: true,
      hasSoundEffects: true,
      hasAmbientSound: lower.includes('ambient') || lower.includes('atmosphere'),
      musicStyle: 'chiptune',
    },
    controls: {
      keyboard: true,
      gamepad: false,
      touch: false,
      primaryControls: {
        move: 'WASD / Arrow Keys',
        action: 'Space / Z',
        pause: 'Escape / P',
      },
    },
    deployment: {
      exportFormats: ['zip', 'blueprint'],
    },
  };

  // Validate against schema — throws ZodError if invalid
  return ProjectBlueprintSchema.parse(blueprint);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deriveTitle(prompt: string): string {
  // Capitalize first ~5 words as a naive title
  const words = prompt.trim().split(/\s+/).slice(0, 5);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function deriveWinConditions(lower: string, genre: string): string[] {
  if (lower.includes('survive') || genre === 'survival') {
    return ['Survive all waves', 'Reach score threshold'];
  }
  if (lower.includes('collect') || lower.includes('coins')) {
    return ['Collect all items'];
  }
  if (genre.includes('shooter')) {
    return ['Defeat the boss', 'Clear all enemies'];
  }
  return ['Reach the goal', 'Achieve target score'];
}

// ---------------------------------------------------------------------------
// Session management helpers (FR-2)
// ---------------------------------------------------------------------------

export function createClarificationSession(
  projectId: string,
  prompt: string,
): ClarificationSession {
  const ambiguous = detectAmbiguity(prompt);
  const questions = generateClarificationQuestions(ambiguous);
  return {
    projectId,
    originalPrompt: prompt,
    questions,
    answers: {},
    complete: questions.length === 0,
  };
}

export function submitAnswer(
  session: ClarificationSession,
  questionId: string,
  answer: string,
): ClarificationSession {
  const updated: ClarificationSession = {
    ...session,
    answers: { ...session.answers, [questionId]: answer },
  };

  const allRequired = updated.questions
    .filter((q) => q.required)
    .every((q) => updated.answers[q.id] !== undefined);

  return { ...updated, complete: allRequired };
}
