# VibeStudio AI — Project Tracker

> Open-Source Multi-Agent Framework for Autonomous 2D Game Generation
>
> SRS Version: 1.0 | Tracker Created: 2026-06-10 | Status: 🟡 In Progress

---

## 📋 Branch Strategy

```
main                    ← stable, production-ready releases
├── develop             ← integration branch (all features merge here first)
│   ├── feature/phase-1-core-mvp
│   │   ├── feature/frontend-scaffold
│   │   ├── feature/backend-scaffold
│   │   ├── feature/director-agent
│   │   └── feature/mechanics-agent
│   ├── feature/phase-2-asset-agent
│   ├── feature/phase-3-audio-agent
│   ├── feature/phase-4-runtime-verification
│   ├── feature/phase-5-self-healing
│   ├── feature/phase-6-multi-provider-ai
│   └── feature/phase-7-production-platform
└── hotfix/*            ← emergency fixes to main
```

**Merge Flow:** `feature/*` → `develop` (PR + squash) → `main` (PR + merge commit)

---

## 🗺️ Overall Progress

| Phase | Name | Duration | Status | Branch |
|-------|------|----------|--------|--------|
| P1 | Core MVP | 2–3 weeks | 🔵 Started | `feature/phase-1-core-mvp` |
| P2 | Asset Agent | 2 weeks | ⬜ Todo | `feature/phase-2-asset-agent` |
| P3 | Audio Agent | 1–2 weeks | ⬜ Todo | `feature/phase-3-audio-agent` |
| P4 | Runtime Verification | 2 weeks | ⬜ Todo | `feature/phase-4-runtime-verification` |
| P5 | Self-Healing System | 2–3 weeks | ⬜ Todo | `feature/phase-5-self-healing` |
| P6 | Multi-Provider AI | 1 week | ⬜ Todo | `feature/phase-6-multi-provider-ai` |
| P7 | Production Platform | 2 weeks | ⬜ Todo | `feature/phase-7-production-platform` |

---

## 📦 Phase 1 — Core MVP

> **Goal:** Playable game generation end-to-end
> **Branch:** `feature/phase-1-core-mvp`
> **Duration:** 2–3 weeks

### 1A. Project Foundation

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Initialize git repo with `main` + `develop` branches | ✅ Done | Initial commit |
| 1.2 | Create `docs/PROJECT_TRACKER.md` | ✅ Done | This file |
| 1.3 | Create root `README.md` | ✅ Done | — |
| 1.4 | Create `.gitignore` for Node.js / TS mono-repo | ✅ Done | — |
| 1.5 | Define mono-repo structure (`packages/`) | ✅ Done | pnpm workspaces |
| 1.6 | Set up root `package.json` with workspaces | ✅ Done | pnpm-workspace.yaml |
| 1.7 | Create `CONTRIBUTING.md` | ⬜ Todo | — |
| 1.8 | Create `LICENSE` (MIT) | ✅ Done | — |

### 1B. Frontend Scaffold (`packages/frontend`)

> **Technology:** React + TypeScript + Vite + TailwindCSS + Zustand
> **Branch:** `feature/frontend-scaffold`

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1B.1 | Scaffold Vite + React + TS project | ✅ Done | Manual scaffold (Vite interactive blocked) |
| 1B.2 | Configure TailwindCSS | ✅ Done | tailwind.config.js + postcss.config.js |
| 1B.3 | Set up Zustand store structure | ✅ Done | src/store/projectStore.ts |
| 1B.4 | Build prompt submission UI | ✅ Done | FR-1 — PromptInput.tsx |
| 1B.5 | Build interactive clarification modal | ✅ Done | FR-2 — ClarificationModal.tsx |
| 1B.6 | Build live build progress visualization | ✅ Done | BuildProgress.tsx with phase pipeline |
| 1B.7 | Build game preview iframe/panel | ✅ Done | GamePreview.tsx |
| 1B.8 | Build source code download UI | ✅ Done | FR-12 — download/open/view-source in GamePreview |
| 1B.9 | Connect to backend via REST + WebSocket | ✅ Done | src/api/client.ts |
| 1B.10 | Responsive layout + accessibility pass | ✅ Done | unique IDs, aria-label on all interactive elements |

### 1C. Backend Scaffold (`packages/backend`)

> **Technology:** Node.js + TypeScript + Fastify + BullMQ + PostgreSQL
> **Branch:** `feature/backend-scaffold`

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1C.1 | Scaffold Fastify TypeScript project | ✅ Done | `index.ts` handles init, health, router |
| 1C.2 | Set up Zod validation schemas | ✅ Done | Fastify request validation working |
| 1C.3 | `POST /projects` endpoint | ✅ Done | FR-8, API Spec §9 |
| 1C.4 | `GET /projects/:id` endpoint | ✅ Done | API Spec §9 |
| 1C.5 | `GET /projects/:id/logs` endpoint | ✅ Done | API Spec §9 |
| 1C.6 | `GET /projects/:id/download` endpoint | ✅ Done | API Spec §9, FR-12 |
| 1C.7 | WebSocket live log streaming | ⬜ Todo | — |
| 1C.8 | BullMQ job queue setup | ✅ Done | `queue.ts` configures `projects` queue |
| 1C.9 | PostgreSQL connection + migrations | ✅ Done | `db.ts` pooling built and wired in routes |
| 1C.10 | `projects` table migration | ✅ Done | 001_create_projects.sql |
| 1C.11 | `agent_runs` table migration | ✅ Done | 002_create_agent_runs.sql |
| 1C.12 | `runtime_errors` table migration | ✅ Done | 003_create_runtime_errors.sql |

### 1D. Director Agent (`packages/agents/director`)

> **Responsibilities:** Requirement gathering, clarification, blueprint generation
> **Branch:** `feature/director-agent`

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1D.1 | Set up Antigravity SDK agent scaffold | ✅ Done | Core agent logic written in `director.ts` |
| 1D.2 | Implement prompt ambiguity detection | ✅ Done | FR-2 — detectAmbiguity() |
| 1D.3 | Implement follow-up question generation | ✅ Done | FR-2 — generateClarificationQuestions() |
| 1D.4 | Implement `ProjectBlueprint` JSON schema | ✅ Done | FR-3 — schema.ts |
| 1D.5 | Blueprint validation with Zod | ✅ Done | ProjectBlueprintSchema |
| 1D.6 | `GameplaySpec` sub-schema | ✅ Done | §8 |
| 1D.7 | `AudioSpec` sub-schema | ✅ Done | §8 |
| 1D.8 | `ControlSpec` sub-schema | ✅ Done | §8 |
| 1D.9 | `DeploymentSpec` sub-schema | ✅ Done | §8 |
| 1D.10 | Director ↔ Orchestrator integration | ✅ Done | Wired in `workers/orchestrator.ts` |

### 1E. Mechanics Agent (`packages/agents/mechanics`)

> **Responsibilities:** Generate Phaser 3 gameplay code
> **Branch:** `feature/mechanics-agent`

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1E.1 | Set up Antigravity SDK agent scaffold | ✅ Done | Core generator written |
| 1E.2 | Generate `src/game/game.js` (Phaser config) | ✅ Done | FR-5 — generateGameConfig() |
| 1E.3 | Generate `src/game/scenes/*` (scene files) | ✅ Done | FR-5 — 5 scenes (Boot/Preload/Menu/Game/GameOver) |
| 1E.4 | Generate `src/game/entities/*` (player, enemy, ui) | ✅ Done | FR-5, §7.2 — Player, Enemy, UI |
| 1E.5 | Implement game loop generation | ✅ Done | FR-5 — GameScene.update() |
| 1E.6 | Implement physics generation | ✅ Done | FR-5 — Arcade physics, gravity per camera type |
| 1E.7 | Implement combat system generation | ✅ Done | FR-5 — bullets, collisions, hit detection |
| 1E.8 | Implement input handling generation | ✅ Done | FR-5 — WASD+arrows, space fire, mouse aim |
| 1E.9 | Win/loss condition code generation | ✅ Done | FR-3 — wave complete, lives=0 game over |

### 1F. Build System (`packages/build-system`)

> **Technology:** Vite + pnpm
> **FR:** FR-8, FR-9

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1F.1 | Scaffold Vite project creator utility | ✅ Done | FR-8 — assembler.ts: buildViteConfig() |
| 1F.2 | Assemble generated modules into project | ✅ Done | FR-8 — assembleProject() writes full tree |
| 1F.3 | Install dependencies via `pnpm install` | ✅ Done | FR-9 — runner.ts: runInstall() |
| 1F.4 | Run `pnpm build` and capture output | ✅ Done | FR-9 — runner.ts: runBuild() |
| 1F.5 | Start `pnpm dev` server | ✅ Done | FR-10 — runner.ts: startDevServer() |
| 1F.6 | Generate export zip package | ⬜ Todo | FR-12 — planned |

---

## 🎨 Phase 2 — Asset Agent

> **Goal:** Inline sprites, tiles, icons, effects — no external dependencies
> **Branch:** `feature/phase-2-asset-agent`
> **Duration:** 2 weeks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Asset Agent scaffold | ✅ Done | packages/agents/asset/src/asset.ts |
| 2.2 | Sprite matrix generation (Option A) | ✅ Done | FR-6 — `buildSpriteMatrices()` |
| 2.3 | Base64 Data URI generation (Option B) | ✅ Done | FR-6 — `matrixToDataURI()` |
| 2.4 | Tile generation | ✅ Done | §7.3 — `buildTileDefinitions()` |
| 2.5 | Icon generation | ✅ Done | §7.3 — `buildIconDefinitions()` |
| 2.6 | Particle / effect generation | ✅ Done | §7.3 — `buildEffectDefinitions()` |
| 2.7 | Asset registry module | ✅ Done | `assetsCode` generator creates `assets.js` |
| 2.8 | Asset injection into Phaser scenes | ✅ Done | Handled via `loadAssets()` |
| 2.9 | Procedural SVG generation (Option C) | ⬜ Todo | FR-6 (future) |

---

## 🎵 Phase 3 — Audio Agent

> **Goal:** Procedural audio — no external audio assets
> **Branch:** `feature/phase-3-audio-agent`
> **Duration:** 1–2 weeks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Audio Agent scaffold | ✅ Done | packages/agents/audio/src/audio.ts |
| 3.2 | Background music system (Web Audio API) | ✅ Done | FR-7 — `generateMusicEngine()` (chiptune/ambient/etc) |
| 3.3 | Sound effects generation | ✅ Done | FR-7 — `generateSfxEngine()` (8 distinct SFX) |
| 3.4 | Ambient sound generation | ✅ Done | FR-7 — `generateAmbientEngine()` (multi-drone pad) |
| 3.5 | `AudioContext` + `OscillatorNode` engine | ✅ Done | FR-7 — implemented purely natively |
| 3.6 | Event-driven audio trigger system | ✅ Done | §7.4 — exports `sfx` and music controls |
| 3.7 | Audio injection into Phaser scenes | ✅ Done | Handled via `initAudio()` and exports |

---

## 🔍 Phase 4 — Runtime Verification

> **Goal:** Automated browser testing with Playwright
> **Branch:** `feature/phase-4-runtime-verification`
> **Duration:** 2 weeks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Playwright + Chromium headless setup | ⬜ Todo | FR-10, §4.D |
| 4.2 | Game launch automation | ⬜ Todo | FR-10 |
| 4.3 | 5-second observation window | ⬜ Todo | FR-10 |
| 4.4 | `console.error` capture | ⬜ Todo | FR-10 |
| 4.5 | Uncaught exception capture | ⬜ Todo | FR-10 |
| 4.6 | Failed network request capture | ⬜ Todo | FR-10 |
| 4.7 | WebGL error capture | ⬜ Todo | FR-10 |
| 4.8 | Screenshot capture | ⬜ Todo | §4.D |
| 4.9 | Telemetry report generation | ⬜ Todo | — |
| 4.10 | Trigger Debugger Agent on failure | ⬜ Todo | FR-11 |

---

## 🩺 Phase 5 — Self-Healing System

> **Goal:** Autonomous error detection + patch + retry loop
> **Branch:** `feature/phase-5-self-healing`
> **Duration:** 2–3 weeks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Debugger Agent scaffold | ⬜ Todo | §7.5 |
| 5.2 | Stack trace capture + parsing | ⬜ Todo | FR-11 |
| 5.3 | Failing file identification | ⬜ Todo | FR-11 |
| 5.4 | Patch generation (minimal surgical) | ⬜ Todo | FR-11, §7.5 |
| 5.5 | File replacement mechanism | ⬜ Todo | FR-11 |
| 5.6 | Application restart after patch | ⬜ Todo | FR-11 |
| 5.7 | Re-test cycle trigger | ⬜ Todo | FR-11 |
| 5.8 | Retry limit enforcement | ⬜ Todo | FR-11 |
| 5.9 | Build failure analysis | ⬜ Todo | §7.5 |
| 5.10 | Rendering issue analysis | ⬜ Todo | §7.5 |

---

## 🤖 Phase 6 — Multi-Provider AI

> **Goal:** OpenRouter + Gemini + Claude + GPT + DeepSeek routing
> **Branch:** `feature/phase-6-multi-provider-ai`
> **Duration:** 1 week

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | OpenRouter integration | ⬜ Todo | §5 AI Layer |
| 6.2 | Gemini provider (default) | ⬜ Todo | §5 AI Layer |
| 6.3 | Claude provider (fallback) | ⬜ Todo | §5 AI Layer |
| 6.4 | GPT provider (fallback) | ⬜ Todo | §5 AI Layer |
| 6.5 | DeepSeek provider (fallback) | ⬜ Todo | §5 AI Layer |
| 6.6 | Model routing logic | ⬜ Todo | §5 AI Layer |
| 6.7 | Model benchmarking utility | ⬜ Todo | — |
| 6.8 | API key management + encryption | ⬜ Todo | NFR §12 Security |

---

## 🏭 Phase 7 — Production Platform

> **Goal:** User accounts, project history, cloud storage, deployment
> **Branch:** `feature/phase-7-production-platform`
> **Duration:** 2 weeks

| # | Task | Status | Notes |
|---|------|--------|-------|
| 7.1 | User authentication system | ⬜ Todo | §11 P7 |
| 7.2 | Project history persistence | ⬜ Todo | §11 P7 |
| 7.3 | Cloud storage integration | ⬜ Todo | §11 P7 |
| 7.4 | One-click deployment support | ⬜ Todo | §11 P7 |
| 7.5 | 100 concurrent project support | ⬜ Todo | NFR §12 Scalability |
| 7.6 | 500 queued project support | ⬜ Todo | NFR §12 Scalability |

---

## ✅ Non-Functional Requirements Checklist

| Requirement | Target | Status |
|-------------|--------|--------|
| First prototype generation | < 3 minutes | ⬜ Not validated |
| Runtime validation | < 30 seconds | ⬜ Not validated |
| Agent startup | < 5 seconds | ⬜ Not validated |
| Concurrent projects | 100 | ⬜ Not validated |
| Queued projects | 500 | ⬜ Not validated |
| Successful builds | 95% | ⬜ Not validated |
| Orchestration uptime | 99% | ⬜ Not validated |
| Sandboxed code execution | Required | ⬜ Not implemented |
| Containerized build envs | Required | ⬜ Not implemented |
| API key encryption | Required | ⬜ Not implemented |

---

## 🗄️ Database Implementation Checklist

| Table | Migration | Status |
|-------|-----------|--------|
| `projects` | `001_create_projects.sql` | ⬜ Todo |
| `agent_runs` | `002_create_agent_runs.sql` | ⬜ Todo |
| `runtime_errors` | `003_create_runtime_errors.sql` | ⬜ Todo |

---

## 🔌 API Endpoints Checklist

| Method | Endpoint | FR | Status |
|--------|----------|----|--------|
| `POST` | `/projects` | FR-8 | ⬜ Todo |
| `GET` | `/projects/:id` | — | ⬜ Todo |
| `GET` | `/projects/:id/logs` | — | ⬜ Todo |
| `GET` | `/projects/:id/download` | FR-12 | ⬜ Todo |
| `WS` | `/projects/:id/stream` | — | ⬜ Todo |

---

## 🔀 Commit Log

| Commit | Branch | Description |
|--------|--------|-------------|
| `1c1399b` | `main` | `chore: initial commit — SRS, tracker, README, .gitignore, LICENSE` |
| — | `develop` | Branched from `main`, pushed to origin |
| `33b36c3` | `feature/phase-1-core-mvp` | `feat(p1): mono-repo package scaffolds and shared types` |
| `ecc5223` | `feature/phase-1-core-mvp` | `feat(p1/backend): Fastify backend scaffold + DB migrations` |

---

## 📅 Future Roadmap (V2/V3)

| Version | Features |
|---------|----------|
| V2 | Godot generation, Unity generation, Multiplayer, Sprite sheet animation, AI narrative systems |
| V3 | 3D game generation, NPC dialogue models, Autonomous game balancing, Automated playtesting agents |

---

> **Legend:** ✅ Done | 🔵 In Progress | ⬜ Todo | ❌ Blocked
