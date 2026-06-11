Based on the `docs/brainplan.md` document, the current project status in `PROJECT_TRACKER.md`, and the architectural details in `ProjectSRS.md`, here is a tailored implementation plan and feasibility analysis for integrating the **Project Brain** into VibeStudio AI.

### ­ƒºá Feasibility Analysis

**Status:** **Highly Feasible & Perfectly Timed**

1. **Timing is Ideal:** You are currently wrapping up Phase 1 (Core MVP) and haven't started Phase 2 (Asset Agent) or Phase 5 (Self-Healing/Debugger). Introducing the Brain *now* prevents massive refactoring later, as the upcoming agents can be built from day one to consume and populate the Brain.
2. **Architecture Compatibility:** VibeStudio's Orchestration Engine already uses Fastify, BullMQ, and PostgreSQL. The Brain can be seamlessly integrated as either a set of JSON files stored alongside the generated game code or as a new structured JSONB table in Postgres.
3. **"Brain Builder" Feasibility:** The concept of a non-LLM "Brain Builder" to extract architecture is brilliant and easily achievable in Node.js using AST parsers (like `ts-morph` or standard Babel) to statically analyze the generated Phaser 3 code without incurring LLM token costs.

---

### ­ƒôØ Tailored Implementation Plan

Here is how we integrate the Project Brain into the existing VibeStudio AI roadmap, tailoring it to your current packages and multi-agent setup.

#### Step 1: Define the Brain Schema (Immediate)
*Target: `packages/shared/src/brain-schema.ts`*
Create strict Zod schemas for the Brain's layers to ensure structured intelligence.
*   **Layer 1:** `BlueprintMemory` (Already partially done in Director Agent's `ProjectBlueprint` schema)
*   **Layer 2:** `ArchitectureMemory` (Dependencies, Phaser Scenes, Entity relationships)
*   **Layer 3 & Audio:** `AssetRegistry` (Sprites, Audio mappings)
*   **Layer 4:** `RuntimeKnowledge` (Metrics from Playwright)
*   **Layer 5:** `BugMemory` (Historical bugs and fixes)
*   **Layer 6:** `DecisionLog` (Agent rationale)

#### Step 2: Brain Storage Service (Backend)
*Target: `packages/backend/src/services/brain.ts`*
Implement a central service in the Orchestrator that agents interact with. 
*   **Decision:** Store the Brain as JSON files in a `.vibebrain/` directory within each generated project workspace. This makes the project entirely portable (a user downloading the source code via your `FR-12` feature gets the Brain too!).
*   The Orchestrator will expose internal API endpoints or function calls for the agents to `readBrain(projectId)` and `updateBrain(projectId, layer, data)`.

#### Step 3: Retrofit Phase 1 Agents (Current Phase)
*Targets: `packages/agents/director` & `packages/agents/mechanics`*
*   **Director Agent:** Currently generates the `ProjectBlueprint`. Modify the orchestrator workflow to save this output directly into **Layer 1: Blueprint**.
*   **Mechanics Agent:** Update its system prompt to output a brief `DecisionLog` alongside its code generation, explaining *why* it chose certain Phaser systems (e.g., Arcade physics vs Matter.js).

#### Step 4: Implement the "Brain Builder" (Build System)
*Target: `packages/build-system/src/brainBuilder.ts`*
*   Add a new step in the `assembler.ts` workflow that runs *after* the Mechanics Agent generates the JS/TS files.
*   The Brain Builder will use a lightweight AST parser to read the generated Phaser code, extract Scene dependencies, identify required assets, and populate **Layer 2: Architecture**.
*   *No LLM required for this step, making it extremely fast.*

#### Step 5: Tailor Phase 2 & 3 (Asset & Audio Agents)
*Targets: `packages/agents/asset` & `packages/agents/audio`*
*   Instead of reading the entire raw game prompt, these agents will now read **Layer 1 (Blueprint)** for art/audio style and **Layer 2 (Architecture)** to know exactly what entities exist.
*   Once they generate the assets (e.g., Sprite Matrices or Audio contexts), they will push their mappings to **Layer 3: Asset Registry**.

#### Step 6: Tailor Phase 4 & 5 (Playwright & Debugger)
*Targets: `packages/runtime-verifier` & `packages/agents/debugger`*
*   **Phase 4 (Playwright):** During the 5-second observation window, the verifier will log load times, FPS, and console errors directly into **Layer 4: Runtime Knowledge**.
*   **Phase 5 (Debugger):** This is where the Brain pays off. When Playwright catches an error, the Debugger Agent won't just get a stack trace. It will receive the stack trace *plus* Layer 2 (Architecture) to find the related file, Layer 3 (Assets) to check for missing sprites, and Layer 5 (Bug Memory) to see if this happened before.
*   Once the Debugger fixes the issue, it writes the root cause and patch into **Layer 5: Bug Memory**.

---

### ­ƒÜÇ Next Steps to Execute

If you'd like to proceed, we can start by writing the **Zod Schemas for the Brain Layers** and setting up the **Brain Storage Service** in the backend. Should I begin scaffolding `packages/shared/src/brain-schema.ts`?