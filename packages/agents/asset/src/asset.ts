/**
 * Asset Agent — Sprite, Tile, Icon & Effect Generator
 * Implements SRS FR-6, §7.3
 *
 * Generates visual assets as inline sprite matrices (Option A)
 * or Base64 Data URIs (Option B). No external dependencies.
 *
 * Outputs a single assets.js module containing:
 *  - SPRITES   : pixel matrix definitions
 *  - REGISTRY  : asset keys → canvas drawing functions
 *  - loadAssets(): registers all textures into Phaser scene
 */

import type { ProjectBlueprint } from '../../director/src/schema.js'
import { AIRouter } from '@vibestudio/shared/src/ai/router.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** 
 * A pixel sprite matrix — each string is a row, each char is one pixel.
 * Format: '0' = transparent, hex digit/letter = palette index.
 */
export type SpriteMatrix = string[]

export interface SpriteDefinition {
  key: string
  width: number
  height: number
  scale: number         // display scale multiplier
  matrix: SpriteMatrix
  palette: Record<string, string>  // char → CSS hex colour
}

export interface AssetRegistry {
  sprites: SpriteDefinition[]
  tiles: SpriteDefinition[]
  icons: SpriteDefinition[]
  effects: SpriteDefinition[]
}

export interface AssetAgentOutput {
  registry: AssetRegistry
  /** assets.js file content — goes into src/game/assets.js */
  assetsCode: string
}

// ---------------------------------------------------------------------------
// Palette presets keyed by art style
// ---------------------------------------------------------------------------

const PALETTES: Record<string, Record<string, string>> = {
  pixel: {
    A: '#4f6ef7', B: '#7090fb', C: '#2733a1',   // blues (player)
    D: '#f87171', E: '#fca5a5', F: '#dc2626',   // reds  (enemy)
    G: '#4ade80', H: '#86efac',                 // greens
    I: '#fbbf24', J: '#fde68a',                 // ambers (coins/bullets)
    K: '#191b28', L: '#252840', M: '#2e3250',   // dark surfaces (tiles)
    N: '#ffffff', O: '#ffffff80',               // white / translucent
    P: '#a855f7', Q: '#c084fc',                 // purples
    R: '#22d3ee', S: '#67e8f9',                 // cyans (effects)
    '0': 'transparent',
  },
  vector: {
    A: '#6366f1', B: '#818cf8', C: '#4338ca',
    D: '#ef4444', E: '#fca5a5', F: '#b91c1c',
    G: '#22c55e', H: '#86efac',
    I: '#eab308', J: '#fef08a',
    K: '#1e293b', L: '#334155', M: '#475569',
    N: '#f8fafc', O: '#94a3b8',
    P: '#8b5cf6', Q: '#c4b5fd',
    R: '#06b6d4', S: '#67e8f9',
    '0': 'transparent',
  },
  minimal: {
    A: '#3b82f6', B: '#93c5fd', C: '#1d4ed8',
    D: '#ef4444', E: '#fca5a5', F: '#991b1b',
    G: '#10b981', H: '#6ee7b7',
    I: '#f59e0b', J: '#fcd34d',
    K: '#111827', L: '#1f2937', M: '#374151',
    N: '#f9fafb', O: '#9ca3af',
    P: '#7c3aed', Q: '#c4b5fd',
    R: '#0891b2', S: '#67e8f9',
    '0': 'transparent',
  },
}

// ---------------------------------------------------------------------------
// Sprite matrix definitions (Option A — FR-6)
// ---------------------------------------------------------------------------

function buildSpriteMatrices(blueprint: ProjectBlueprint): SpriteDefinition[] {
  const { genre } = blueprint.gameplay
  const palette = PALETTES[blueprint.artStyle] ?? PALETTES.pixel

  const base: SpriteDefinition[] = [
    // ── Player ──────────────────────────────────────────────────────────
    {
      key: 'player',
      width: 12, height: 16, scale: 2,
      palette,
      matrix: [
        '0000AABB0000',
        '000AABBCBB00',
        '00ABBBBBCBA0',
        '00ABBBBBCBA0',
        '000ABBBCBA00',
        '00AABBBBBA00',
        '0AABBBBBBA00',
        '0AAABBBBAAA0',
        '0AAABBBBAAA0',
        '0AABBBBBBA00',
        '00AAABBBBA00',
        '000AACBBBA00',
        '00AAA0000AAA',
        '0AAAA0000AAA',
        '0AAA00000AA0',
        '000000000000',
      ],
    },
    // ── Enemy variants by genre ──────────────────────────────────────────
    buildEnemySprite(genre, palette),
    // ── Bullet / Projectile ──────────────────────────────────────────────
    {
      key: 'bullet',
      width: 6, height: 6, scale: 1.5,
      palette,
      matrix: [
        '0IIII0',
        'IJJJJI',
        'IJJJJI',
        'IJJJJI',
        'IJJJJI',
        '0IIII0',
      ],
    },
    // ── Coin / Pickup ────────────────────────────────────────────────────
    {
      key: 'coin',
      width: 8, height: 8, scale: 2,
      palette,
      matrix: [
        '00IIII00',
        '0IJJJJI0',
        'IJJNNNJI',
        'IJJNJNJI',
        'IJJNJNJI',
        'IJJNJNJI',
        '0IJJJJI0',
        '00IIII00',
      ],
    },
    // ── Health Pack ──────────────────────────────────────────────────────
    {
      key: 'health',
      width: 10, height: 10, scale: 2,
      palette,
      matrix: [
        '0000GG0000',
        '000GHHHG00',
        '00GHGHHGH0',
        '0GHGGGGGH0',
        'GGHGGGGGHG',
        'GGHGGGGGHG',
        '0GHGGGGGH0',
        '00GHGHHGH0',
        '000GHHHG00',
        '0000GG0000',
      ],
    },
    // ── Power-Up / Star ──────────────────────────────────────────────────
    {
      key: 'powerup',
      width: 10, height: 10, scale: 2,
      palette,
      matrix: [
        '0000PP0000',
        '000PQQP000',
        '0PPQQQQPP0',
        'PQQQQQQQQP',
        'PQQQNNQQQ0',
        '0PQQNNQQ00',
        '00PQQQQP00',
        '000PQQP000',
        '0000PP0000',
        '0000000000',
      ],
    },
    // ── Explosion frame 1 ────────────────────────────────────────────────
    {
      key: 'explosion_1',
      width: 16, height: 16, scale: 2,
      palette,
      matrix: [
        '0000000II0000000',
        '000000IJJI000000',
        '0000IIIJJIII0000',
        '000IJJIJJIJJI000',
        '00IJJJIJJIJIJJI0',
        '00IJJIIJJIJJJJI0',
        '0IJJIIJJIJIJJJII',
        'IIJJIIJJIJJIJJII',
        'IIJJIIJJIJJIJJII',
        '0IJJIIJJIJIJJJII',
        '00IJJIIJJIJJJJI0',
        '00IJJJIJJIJIJJI0',
        '000IJJIJJIJJI000',
        '0000IIIJJIII0000',
        '000000IJJI000000',
        '0000000II0000000',
      ],
    },
  ]

  return base
}

function buildEnemySprite(genre: string, palette: Record<string, string>): SpriteDefinition {
  // Different enemy shapes per genre
  const matrices: Record<string, SpriteMatrix> = {
    survival: [
      '000DDDD000',
      '00DEFFED00',
      '0DEFFFFED0',
      '0DFFFFFED0',
      '0DFFFFFFE0',
      '0DFFFFFED0',
      '00DEFFFED0',
      '000DDDDD00',
      '0DD00000DD',
      '0FD00000DF',
    ],
    shooter: [
      '00DDDDDD00',
      '0DEFFFEFD0',
      'DEFFFFFFF0',
      'DFFFFFEFFD',
      'DFEFFFFFFD',
      '0DFFFFFED0',
      '00DDDDDD00',
      '000DDDD000',
      '00D0000D00',
      '0DD00000DD',
    ],
    platformer: [
      '0000DDDD00',
      '000DEFFED0',
      '00DEFFFFED',
      '0DEFFFFFED',
      '0DFFFFFFE0',
      '00DFFFFFD0',
      '000DDDDDD0',
      '000D0000D0',
      '00DD0000DD',
      '0DDD0000DD',
    ],
    arcade: [
      '000DDDDDD0',
      '00DEEEEDDD',
      '0DEFFFFFFD',
      'DEFFFEEFFED',
      'DEFFFFFFFED',
      '0DFFFFFFED0',
      '00DDDDDDDD',
      '000D0000D0',
    ],
  }

  const genreKey = Object.keys(matrices).find(k => genre.includes(k)) ?? 'survival'
  const mat = matrices[genreKey]

  return {
    key: 'enemy',
    width: mat[0].length,
    height: mat.length,
    scale: 2,
    palette,
    matrix: mat,
  }
}

// ---------------------------------------------------------------------------
// Tile definitions (FR-6, §7.3)
// ---------------------------------------------------------------------------

function buildTileDefinitions(blueprint: ProjectBlueprint): SpriteDefinition[] {
  const palette = PALETTES[blueprint.artStyle] ?? PALETTES.pixel

  return [
    // Floor tile
    {
      key: 'tile_floor',
      width: 16, height: 16, scale: 2,
      palette,
      matrix: [
        'KKKKKKKKKKKKKKKK',
        'KLLLLLLLLLLLLLLK',
        'KLMMMMMMMMMMMMLK',
        'KLMKKKKKKKKKMMLK',
        'KLMKLLLLLLKMLMK',
        'KLMKLMMMMKLMLMK',
        'KLMKLMMMMKLMLMK',
        'KLMKLLLLLLKMLMK',
        'KLMKKKKKKKKKMMLK',
        'KLMMMMMMMMMMMMLK',
        'KLLLLLLLLLLLLLLK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
      ],
    },
    // Wall tile
    {
      key: 'tile_wall',
      width: 16, height: 16, scale: 2,
      palette,
      matrix: [
        'LLLLLLLLLLLLLLLL',
        'LMMMMMMMMMMMMML L',
        'LMNNNNNNNNNNNNML',
        'LMNLLLLLLLLLLNML',
        'LMNLLLLLLLLLNMML',
        'LMNLLLLLLLLLNMML',
        'LMNLLLLLLLLLNMML',
        'LMNNNNNNNNNNNNML',
        'LMMMMMMMMMMMMML L',
        'LLLLLLLLLLLLLLLL',
        'LLLLLLLLLLLLLLLL',
        'LLLLLLLLLLLLLLLL',
        'LLLLLLLLLLLLLLLL',
        'LLLLLLLLLLLLLLLL',
        'LLLLLLLLLLLLLLLL',
        'LLLLLLLLLLLLLLLL',
      ],
    },
    // Platform tile (side-scroller)
    {
      key: 'tile_platform',
      width: 16, height: 8, scale: 2,
      palette,
      matrix: [
        'GGGGGGGGGGGGGGGG',
        'GHHHHHHHHHHHHHGH',
        'GHHNNNNNNNNNNHGH',
        'GHHNLLLLLLLLNHGH',
        'GHHNLLLLLLLLNHGH',
        'GHHNNNNNNNNNNHGH',
        'GHHHHHHHHHHHHHGH',
        'GGGGGGGGGGGGGGGG',
      ],
    },
    // Background decoration
    {
      key: 'tile_bg',
      width: 16, height: 16, scale: 2,
      palette,
      matrix: [
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKLKKKKKKLKKKKKK',
        'KLLLKKKKKLLLKKKK',
        'KKLKKKKKKLKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKLKKKKKKLKKKK',
        'KKKKLKKKKKKLKKKK',
        'KKKLLLKKKKLLLKKK',
        'KKKKLKKKKKKLKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
        'KKKKKKKKKKKKKKKK',
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// Effect particles
// ---------------------------------------------------------------------------

function buildEffectDefinitions(blueprint: ProjectBlueprint): SpriteDefinition[] {
  const palette = PALETTES[blueprint.artStyle] ?? PALETTES.pixel

  return [
    {
      key: 'particle_spark',
      width: 4, height: 4, scale: 1,
      palette,
      matrix: ['0II0', 'IJJI', 'IJJI', '0II0'],
    },
    {
      key: 'particle_smoke',
      width: 6, height: 6, scale: 1,
      palette,
      matrix: ['00MM00', '0MLLM0', 'MLOOML', 'MLOTML', '0MLLM0', '00MM00'],
    },
    {
      key: 'shockwave',
      width: 8, height: 8, scale: 2,
      palette,
      matrix: [
        '00RRRR00',
        '0RS00SR0',
        'RS0000SR',
        'R0000000R',
        'R0000000R',
        'RS0000SR',
        '0RS00SR0',
        '00RRRR00',
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// Icon definitions
// ---------------------------------------------------------------------------

function buildIconDefinitions(): SpriteDefinition[] {
  const palette = PALETTES.pixel

  return [
    {
      key: 'icon_heart',
      width: 9, height: 8, scale: 2,
      palette,
      matrix: [
        '0DD0DDD00',
        'DDEFDDEFD',
        'DDFFFFFFE',
        '0DFFFFFFF',
        '00DFFFFFF',
        '000DFFFFF',
        '0000DFFFD',
        '00000DDD0',
      ],
    },
    {
      key: 'icon_skull',
      width: 9, height: 10, scale: 2,
      palette,
      matrix: [
        '000DDDDD0',
        '00DDDDDDD',
        '0DDEFFED0',
        '0DDFFFFFD',
        '0DDFEDFD0',
        '0DDDDDDDD',
        '00DDDDDDD',
        '000DD0DD0',
        '0000DDDD0',
        '000000000',
      ],
    },
    {
      key: 'icon_star',
      width: 9, height: 9, scale: 2,
      palette,
      matrix: [
        '0000I0000',
        '000IJI000',
        'IIIJJJIII',
        '0IJJJJJI0',
        '00IJJJJI0',
        '0IJJIJJI0',
        '0IJ00JJI0',
        '0I000IJI0',
        '00000I000',
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// Base64 Data URI generation (Option B — FR-6)
// Converts a sprite matrix to a data URI using a micro canvas renderer
// ---------------------------------------------------------------------------

export function matrixToDataURI(def: SpriteDefinition): string {
  // We produce the JS code that generates the data URI at runtime
  // (actual canvas rendering happens in the browser)
  return `(function() {
  const c = document.createElement('canvas');
  c.width = ${def.width}; c.height = ${def.height};
  const ctx = c.getContext('2d');
  const palette = ${JSON.stringify(def.palette)};
  const matrix = ${JSON.stringify(def.matrix)};
  matrix.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = palette[row[x]];
      if (!col || col === 'transparent') continue;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
  });
  return c.toDataURL('image/png');
})()`
}

// ---------------------------------------------------------------------------
// Code generator — produces assets.js
// ---------------------------------------------------------------------------

function generateAssetsCode(registry: AssetRegistry): string {
  const allSprites = [
    ...registry.sprites,
    ...registry.tiles,
    ...registry.icons,
    ...registry.effects,
  ]

  const spriteBlocks = allSprites.map(def => `
  // ${def.key} (${def.width}×${def.height})
  {
    const c = scene.make.graphics({ x: 0, y: 0, add: false })
    const palette = ${JSON.stringify(def.palette)}
    const matrix  = ${JSON.stringify(def.matrix)}
    matrix.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const col = palette[row[x]]
        if (!col || col === 'transparent') continue
        const hex = parseInt(col.replace('#',''), 16)
        c.fillStyle(hex, col.endsWith('80') ? 0.5 : 1)
        c.fillRect(x, y, 1, 1)
      }
    })
    c.generateTexture('${def.key}', ${def.width}, ${def.height})
    c.destroy()
  }`).join('\n')

  return `/**
 * VibeStudio AI — Generated Asset Registry
 * Implements SRS FR-6 — Option A (inline sprite matrices)
 *
 * AUTO-GENERATED by Asset Agent — do not edit manually
 */

// ---------------------------------------------------------------------------
// Sprite matrices
// ---------------------------------------------------------------------------

export const SPRITE_DEFS = ${JSON.stringify(allSprites, null, 2)}

// ---------------------------------------------------------------------------
// Asset loader — call from PreloadScene.create() or _generateTextures()
// ---------------------------------------------------------------------------

export function loadAssets(scene) {
  ${spriteBlocks}
}

// ---------------------------------------------------------------------------
// Asset key registry (for type-safe access)
// ---------------------------------------------------------------------------

export const ASSET_KEYS = {
${allSprites.map(s => `  ${s.key}: '${s.key}',`).join('\n')}
}
`
}

// ---------------------------------------------------------------------------
// Main entry point (FR-6)
// ---------------------------------------------------------------------------

export async function generateAssets(
  blueprint: ProjectBlueprint,
  aiRouter?: AIRouter,
  aiProvider?: 'auto' | 'gemini' | 'claude' | 'gpt' | 'deepseek'
): Promise<AssetAgentOutput> {
  let registry: AssetRegistry = {
    sprites: buildSpriteMatrices(blueprint),
    tiles:   buildTileDefinitions(blueprint),
    icons:   buildIconDefinitions(),
    effects: buildEffectDefinitions(blueprint),
  }

  if (aiRouter) {
    const systemPrompt = `You are the VibeStudio AI Asset Agent.
Modify the visual asset registry based on the ProjectBlueprint.
Return a raw JSON object with this EXACT structure (No Markdown, No Backticks):
{
  "sprites": [ { "key": string, "width": number, "height": number, "scale": number, "matrix": [string, string], "palette": { "char": "#hex" } } ],
  "tiles": [ ... ],
  "icons": [ ... ],
  "effects": [ ... ]
}
Make sure all arrays are populated correctly based on the style requested.`;

    try {
      const response = await aiRouter.generate(`${systemPrompt}\n\nProjectBlueprint: ${JSON.stringify(blueprint)}`, { jsonMode: true, model: aiProvider, maxTokens: 8000 });
      const rawData = JSON.parse(response.content);
      if (rawData.sprites && rawData.tiles && rawData.icons && rawData.effects) {
        registry = rawData as AssetRegistry;
      }
    } catch (e) {
      console.warn('AI Asset generation failed. Falling back to deterministic config.', e);
    }
  }

  const assetsCode = generateAssetsCode(registry)

  return { registry, assetsCode }
}
