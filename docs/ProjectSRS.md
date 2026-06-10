\# Software Requirements Specification (SRS)



\# VibeStudio AI



\### Open-Source Multi-Agent Framework for Autonomous 2D Game Generation



Version: 1.0



Status: Proposed



\---



\# 1. Introduction



\## 1.1 Purpose



VibeStudio AI is an open-source AI-native development platform that transforms natural language game descriptions into fully playable 2D browser games.



The platform uses a multi-agent architecture where specialized AI agents independently generate:



\* Game mechanics and gameplay code

\* Visual assets

\* Audio and music systems

\* Runtime fixes and debugging patches



The system automatically assembles generated artifacts into a deployable web application, validates execution through automated browser testing, and repairs runtime failures through iterative self-healing cycles.



The primary objective is rapid game prototyping through AI-assisted development ("Vibe Coding").



\---



\# 2. Product Vision



\## Vision Statement



> "Describe a game in plain English and receive a playable browser game with assets, audio, and gameplay automatically generated, tested, repaired, and deployed."



\---



\# 3. Goals



\### Primary Goals



\* Generate complete 2D browser games from prompts

\* Enable autonomous multi-agent collaboration

\* Eliminate manual asset sourcing

\* Automatically detect and repair runtime failures

\* Produce production-ready source code

\* Support multiple LLM providers



\### Non-Goals (Version 1)



\* 3D game generation

\* Multiplayer networking

\* Native mobile builds

\* Commercial asset generation pipelines

\* Marketplace publishing automation



\---



\# 4. High-Level Architecture



\## System Components



\### A. Frontend



Responsibilities:



\* Prompt submission

\* Interactive clarification workflow

\* Live build progress visualization

\* Generated game preview

\* Source code download

\* Deployment management



Technology:



\* React

\* TypeScript

\* Vite

\* TailwindCSS

\* Zustand



\---



\### B. Orchestration Backend



Responsibilities:



\* Agent lifecycle management

\* Workflow orchestration

\* Context routing

\* Build management

\* Runtime verification

\* Self-healing execution



Technology:



\* Node.js

\* TypeScript

\* Fastify

\* Google Antigravity SDK



\---



\### C. Agent Layer



Contains:



1\. Director Agent

2\. Mechanics Agent

3\. Asset Agent

4\. Audio Agent

5\. Debugger Agent



\---



\### D. Runtime Verification Engine



Responsibilities:



\* Launch game

\* Run diagnostics

\* Capture browser telemetry

\* Collect stack traces

\* Trigger debugging cycles



Technology:



\* Playwright

\* Chromium Headless



\---



\### E. Build System



Responsibilities:



\* Create Vite projects

\* Assemble generated modules

\* Install dependencies

\* Start development server

\* Generate export package



Technology:



\* Vite

\* pnpm



\---



\# 5. Technology Stack



\## Frontend



| Component  | Technology      |

| ---------- | --------------- |

| Framework  | React           |

| Language   | TypeScript      |

| Build Tool | Vite            |

| UI         | TailwindCSS     |

| State      | Zustand         |

| Forms      | React Hook Form |

| Validation | Zod             |



\---



\## Backend



| Component       | Technology             |

| --------------- | ---------------------- |

| Runtime         | Node.js                |

| Language        | TypeScript             |

| API             | Fastify                |

| Validation      | Zod                    |

| Agent Framework | Google Antigravity SDK |

| Queue           | BullMQ                 |

| Storage         | PostgreSQL             |



\---



\## AI Layer



| Component       | Technology            |

| --------------- | --------------------- |

| Agent Framework | Antigravity SDK       |

| Model Routing   | OpenRouter            |

| Default Models  | Gemini                |

| Fallback Models | Claude, GPT, DeepSeek |



\---



\## Runtime Verification



| Component          | Technology  |

| ------------------ | ----------- |

| Browser Automation | Playwright  |

| Browser            | Chromium    |

| Screenshots        | Playwright  |

| Logs               | Console API |



\---



\## Game Runtime



| Component | Technology     |

| --------- | -------------- |

| Engine    | Phaser 3       |

| Rendering | WebGL / Canvas |

| Audio     | Web Audio API  |

| Controls  | Gamepad API    |



\---



\# 6. Functional Requirements



\# FR-1 Prompt Intake



The system shall accept a natural language game description.



Example:



> Create a top-down zombie survival game with pixel art graphics and wave-based combat.



\---



\# FR-2 Interactive Clarification



The Director Agent shall:



\* Detect ambiguity

\* Ask follow-up questions

\* Refine requirements

\* Generate a final blueprint



Example:



Questions:



\* Single-player or multiplayer?

\* Pixel art style?

\* Difficulty level?



Output:



```json

{

&#x20; "genre": "survival",

&#x20; "camera": "top\_down",

&#x20; "art\_style": "pixel",

&#x20; "difficulty": "medium"

}

```



\---



\# FR-3 Blueprint Generation



The Director shall generate a validated schema.



Schema Categories:



\* Gameplay

\* Visual Style

\* Audio Style

\* Controls

\* Win Conditions

\* Loss Conditions



\---



\# FR-4 Agent Spawning



The orchestration engine shall spawn:



\* Mechanics Agent

\* Asset Agent

\* Audio Agent



in parallel.



\---



\# FR-5 Mechanics Generation



The Mechanics Agent shall generate:



\### Files



```text

src/game/game.js

src/game/scenes/\*

src/game/entities/\*

```



\### Responsibilities



\* Game loop

\* Physics

\* Combat

\* UI logic

\* Input handling



\---



\# FR-6 Asset Generation



The Asset Agent shall generate:



\### Supported Formats



\#### Option A



Inline sprite matrices



```javascript

const PLAYER = \[

"001100",

"011110",

"111111"

];

```



\#### Option B



Base64 Data URIs



```javascript

data:image/png;base64,...

```



\#### Option C (Future)



Procedural SVG generation



\---



\# FR-7 Audio Generation



The Audio Agent shall generate:



\### Audio Categories



\* Background music

\* Sound effects

\* Ambient sounds



\### Implementation



Using:



```javascript

AudioContext

OscillatorNode

GainNode

```



No external audio assets.



\---



\# FR-8 Compilation



Generated outputs shall be assembled into:



```text

/project

&#x20;├─ src

&#x20;├─ public

&#x20;├─ package.json

&#x20;└─ vite.config.js

```



\---



\# FR-9 Build Execution



System shall execute:



```bash

pnpm install

pnpm build

```



Failures routed to Debugger Agent.



\---



\# FR-10 Runtime Verification



System shall launch:



```bash

pnpm dev

```



Then:



1\. Open browser

2\. Load page

3\. Observe 5 seconds

4\. Capture:



\* console.error

\* uncaught exceptions

\* failed network requests

\* WebGL errors



\---



\# FR-11 Self-Healing



When errors occur:



\### Workflow



1\. Capture stack trace

2\. Determine failing file

3\. Invoke Debugger Agent

4\. Generate patch

5\. Replace file

6\. Restart application

7\. Re-test



Repeat until:



\* Success

\* Retry limit reached



\---



\# FR-12 Game Export



Users shall be able to:



\* Download source code

\* Download zip

\* Export blueprint

\* Export assets



\---



\# 7. Agent Specifications



\# 7.1 Director Agent



\## Responsibilities



\* Requirement gathering

\* Clarification

\* Blueprint generation



\## Inputs



User prompt



\## Outputs



Blueprint JSON



\---



\# 7.2 Mechanics Agent



\## Responsibilities



Generate Phaser gameplay systems.



\### Output Files



```text

game.js

player.js

enemy.js

ui.js

```



\---



\# 7.3 Asset Agent



\## Responsibilities



Generate:



\* Sprites

\* Tiles

\* Icons

\* Effects



\### Constraints



No external dependencies.



\---



\# 7.4 Audio Agent



\## Responsibilities



Generate:



\* Music systems

\* Sound effects

\* Event audio



\### Constraints



Web Audio API only.



\---



\# 7.5 Debugger Agent



\## Responsibilities



Analyze:



\* Build failures

\* Runtime crashes

\* Rendering issues



Generate minimal surgical patches.



\---



\# 8. Data Models



\## Project Blueprint



```typescript

interface ProjectBlueprint {

&#x20; title: string;



&#x20; genre: string;



&#x20; artStyle: string;



&#x20; gameplay: GameplaySpec;



&#x20; audio: AudioSpec;



&#x20; controls: ControlSpec;



&#x20; deployment: DeploymentSpec;

}

```



\---



\## Build Status



```typescript

interface BuildStatus {

&#x20; projectId: string;



&#x20; phase:

&#x20;   | "director"

&#x20;   | "generation"

&#x20;   | "assembly"

&#x20;   | "verification"

&#x20;   | "debugging"

&#x20;   | "completed";



&#x20; progress: number;

}

```



\---



\# 9. API Specification



\## POST /projects



Creates project.



Request:



```json

{

&#x20; "prompt": "Create a space shooter"

}

```



Response:



```json

{

&#x20; "projectId": "abc123"

}

```



\---



\## GET /projects/:id



Returns project state.



\---



\## GET /projects/:id/logs



Returns execution logs.



\---



\## GET /projects/:id/download



Downloads source package.



\---



\# 10. Database Schema



\## Projects



```sql

CREATE TABLE projects (

&#x20; id UUID PRIMARY KEY,

&#x20; prompt TEXT,

&#x20; blueprint JSONB,

&#x20; status VARCHAR(50),

&#x20; created\_at TIMESTAMP

);

```



\---



\## Agent Runs



```sql

CREATE TABLE agent\_runs (

&#x20; id UUID PRIMARY KEY,

&#x20; project\_id UUID,

&#x20; agent\_name VARCHAR(50),

&#x20; status VARCHAR(50),

&#x20; output JSONB

);

```



\---



\## Runtime Errors



```sql

CREATE TABLE runtime\_errors (

&#x20; id UUID PRIMARY KEY,

&#x20; project\_id UUID,

&#x20; stacktrace TEXT,

&#x20; file\_path TEXT,

&#x20; created\_at TIMESTAMP

);

```



\---



\# 11. Phase-Wise Implementation Plan



\# Phase 1 – Core MVP



Duration: 2–3 Weeks



Deliverables:



\* React frontend

\* Director Agent

\* Mechanics Agent

\* Phaser generation

\* Project assembly



Output:



Playable game generation



\---



\# Phase 2 – Asset Agent



Duration: 2 Weeks



Deliverables:



\* Sprite generation

\* Tile generation

\* Asset registry

\* Asset injection



\---



\# Phase 3 – Audio Agent



Duration: 1–2 Weeks



Deliverables:



\* Procedural audio

\* Music generation

\* SFX generation



\---



\# Phase 4 – Runtime Verification



Duration: 2 Weeks



Deliverables:



\* Playwright integration

\* Telemetry capture

\* Error detection



\---



\# Phase 5 – Self-Healing System



Duration: 2–3 Weeks



Deliverables:



\* Debugger Agent

\* Patch generation

\* Retry orchestration



\---



\# Phase 6 – Multi-Provider AI



Duration: 1 Week



Deliverables:



\* OpenRouter support

\* Gemini support

\* Claude support

\* Model benchmarking



\---



\# Phase 7 – Production Platform



Duration: 2 Weeks



Deliverables:



\* User accounts

\* Project history

\* Cloud storage

\* Deployment support



\---



\# 12. Non-Functional Requirements



\## Performance



\* First prototype generation < 3 minutes

\* Runtime validation < 30 seconds

\* Agent startup < 5 seconds



\---



\## Scalability



Support:



\* 100 concurrent projects

\* 500 queued projects



\---



\## Reliability



Target:



\* 95% successful builds

\* 99% orchestration uptime



\---



\## Security



\* Sandboxed code execution

\* Containerized build environments

\* File access restrictions

\* API key encryption



\---



\# 13. Future Roadmap



\## Version 2



\* Godot generation

\* Unity generation

\* Multiplayer generation

\* Sprite sheet animation

\* AI-generated narrative systems



\## Version 3



\* 3D game generation

\* NPC dialogue models

\* Autonomous game balancing

\* Automated playtesting agents



\---



\# Success Criteria



A user provides a single prompt.



The system:



1\. Clarifies requirements.

2\. Generates gameplay.

3\. Generates assets.

4\. Generates audio.

5\. Assembles project.

6\. Runs diagnostics.

7\. Fixes errors automatically.

8\. Produces a playable browser game.

9\. Returns downloadable source code.



No manual coding should be required for successful completion.



