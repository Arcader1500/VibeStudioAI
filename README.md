# VibeStudio AI

> **Open-Source Multi-Agent Framework for Autonomous 2D Browser Game Generation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status: WIP](https://img.shields.io/badge/Status-WIP-orange.svg)]()

---

## 🎮 What is VibeStudio AI?

VibeStudio AI transforms a plain-English game description into a **fully playable 2D browser game** — with no manual coding required.

> *"Describe a game in plain English and receive a playable browser game with assets, audio, and gameplay automatically generated, tested, repaired, and deployed."*

---

## 🏗️ Architecture

```
User Prompt
    │
    ▼
┌───────────────┐
│ Director Agent│  ← clarifies requirements, produces Blueprint JSON
└───────┬───────┘
        │  Blueprint
        ▼
┌───────────────────────────────────┐
│         Orchestration Engine      │
│   (Fastify + BullMQ + Antigrav.)  │
└──────┬──────────┬─────────┬───────┘
       │          │         │
       ▼          ▼         ▼
  Mechanics    Asset      Audio
    Agent      Agent      Agent
  (Phaser 3)  (Sprites)  (Web Audio)
       │          │         │
       └──────────┴─────────┘
                  │
           Assembly + Build
           (Vite + pnpm)
                  │
           Runtime Verification
           (Playwright + Chromium)
                  │
         ┌────────┴────────┐
         ▼                 ▼
       ✅ Pass          ❌ Fail
      Game Ready      Debugger Agent
                      → Patch → Retry
```

---

## 🧩 Agents

| Agent | Responsibility |
|-------|---------------|
| **Director** | Clarifies prompt, generates game Blueprint JSON |
| **Mechanics** | Generates Phaser 3 gameplay code (game loop, physics, combat, input) |
| **Asset** | Generates sprites, tiles, icons via inline matrices or Base64 URIs |
| **Audio** | Generates procedural music & SFX via Web Audio API |
| **Debugger** | Analyzes runtime errors, generates surgical patches, triggers retry |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + TailwindCSS + Zustand |
| Backend | Node.js + TypeScript + Fastify + BullMQ + PostgreSQL |
| Agents | Google Antigravity SDK |
| AI Routing | OpenRouter (Gemini default, Claude/GPT/DeepSeek fallback) |
| Game Engine | Phaser 3 |
| Testing | Playwright + Chromium Headless |
| Build | Vite + pnpm |

---

## 📁 Repository Structure

```
VibeStudioAI/
├── docs/
│   ├── ProjectSRS.md          ← Software Requirements Specification
│   └── PROJECT_TRACKER.md     ← Implementation progress tracker
├── packages/
│   ├── frontend/              ← React UI (prompt input, progress, preview)
│   ├── backend/               ← Fastify orchestration server
│   ├── agents/
│   │   ├── director/          ← Director Agent
│   │   ├── mechanics/         ← Mechanics Agent
│   │   ├── asset/             ← Asset Agent
│   │   ├── audio/             ← Audio Agent
│   │   └── debugger/          ← Debugger Agent
│   └── build-system/          ← Vite project assembly utilities
├── .gitignore
├── package.json               ← pnpm workspace root
└── README.md
```

---

## 🚀 Getting Started

> ⚠️ Project is currently in active development (Phase 1 — Core MVP)

```bash
# Clone the repository
git clone https://github.com/Arcader1500/VibeStudioAI.git
cd VibeStudioAI

# Install dependencies (requires pnpm)
pnpm install

# Start development
pnpm dev
```

---

## 📋 Implementation Phases

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 1 | Core MVP (Frontend + Backend + Director + Mechanics) | 2–3 wks | 🔵 In Progress |
| 2 | Asset Agent | 2 wks | ⬜ Planned |
| 3 | Audio Agent | 1–2 wks | ⬜ Planned |
| 4 | Runtime Verification (Playwright) | 2 wks | ⬜ Planned |
| 5 | Self-Healing System (Debugger Agent) | 2–3 wks | ⬜ Planned |
| 6 | Multi-Provider AI (OpenRouter) | 1 wk | ⬜ Planned |
| 7 | Production Platform | 2 wks | ⬜ Planned |

See [`docs/PROJECT_TRACKER.md`](./docs/PROJECT_TRACKER.md) for detailed task tracking.

---

## 📖 Documentation

- [Software Requirements Specification](./docs/ProjectSRS.md)
- [Project Tracker](./docs/PROJECT_TRACKER.md)

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
