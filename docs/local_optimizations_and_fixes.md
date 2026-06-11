# VibeStudio AI: Local Optimizations & Fixes

Since VibeStudio AI will be running on your local machine for a single user (maximum ~5 games a day), infrastructure scaling and CPU compute costs are not a concern. Your primary goal is ensuring **LLM token efficiency** and preventing **runaway API costs** from infinite agent loops on OpenRouter.

Here is the focused list of fixes and optimizations to implement.

## 1. Essential Guardrails (Preventing Runaway Costs)

Because you are using local compute, a hanging Playwright process won't bankrupt you on AWS, but an infinite loop in the Debugger Agent *will* rapidly burn through your OpenRouter API balance as context windows grow.

*   **Implement a Hard Retry Limit:** Hardcode a maximum retry cap in the Orchestrator (e.g., `MAX_RETRIES = 3`). If the Debugger Agent fails to fix the game after 3 attempts, the workflow should immediately halt and alert you, rather than endlessly attempting to patch and re-test.
*   **OpenRouter Budget Limits:** Go to your OpenRouter dashboard and set a strict daily spending limit (e.g., $1.00 or $5.00/day). If the orchestration logic fails and an agent runs away overnight, this physical API cutoff will save you from an accidental massive bill.
*   **Cap Planning Cycles:** Limit the Director Agent to a maximum of 2 or 3 clarification questions per prompt. If the agent asks too many questions, default to a standard configuration to force the generation forward.

## 2. Token Optimizations (Minimizing Cost per Game)

For generating 5 games a day, your base LLM costs are already extremely low (cents per day). However, implementing these optimizations will keep context windows lean and execution blazing fast.

*   **Prompt Caching:** DeepSeek V4 (and other modern models on OpenRouter) support prompt caching. Structure your API calls so that the massive Phaser 3 system instructions and strict Zod Schemas are placed at the *very beginning* of the prompt. If you generate multiple games in a session, or if the Debugger Agent loops, the system will hit the cache, dropping input token costs dramatically (from ~$0.15/1M to ~$0.05/1M).
*   **AST "Brain Builder" (Zero-Token Architecture Extraction):** Instead of passing the entire generated `game.js` into an LLM to figure out the file structure, use standard Node.js AST parsing tools (like Babel or `ts-morph`) in your Vite build step. This extracts the architecture (Layer 2) locally using your CPU, costing $0 in API fees and stripping out ~10,000 input tokens from downstream agents.

## 3. Workflow & Agent Optimizations

*   **Integrate "Bug Memory" (Layer 5):** The biggest risk in automated debugging is the "Agent-to-Environment Ping-Pong," where an agent fixes File A (breaking File B), then fixes File B (breaking File A), looping forever. By writing a concise JSON log of *past failures and applied patches* (Layer 5: Bug Memory) and passing it to the Debugger, the LLM will recognize its past mistakes and try new approaches, increasing the success rate within the 3-retry limit.
*   **Targeted JSON Contexts:** Ensure your Asset, Audio, and Debugger agents only read the specific `Project Brain` JSON layers they need. For instance, the Audio Agent should only receive the Blueprint (Layer 1) and Architecture (Layer 2) JSONs, rather than the raw text of the user's prompt or the raw code files.
*   **Diff-Based Patching (Optional but powerful):** If your Debugger Agent frequently hits output limits by rewriting 500-line files to change one line, prompt it to output Unified Diffs (`.patch`). You can then apply the diff locally via a Node script, massively saving on *Output Tokens* (which are usually 2x to 3x more expensive than Input Tokens).
