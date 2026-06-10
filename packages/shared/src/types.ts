/**
 * VibeStudio AI — Shared Type Definitions
 * Sourced from SRS §8 Data Models
 */

// ---------------------------------------------------------------------------
// Project Blueprint (FR-3, §8)
// ---------------------------------------------------------------------------

export interface GameplaySpec {
  genre: string;               // e.g. "survival", "platformer", "shooter"
  camera: "top_down" | "side_scroller" | "isometric" | "fixed";
  difficulty: "easy" | "medium" | "hard";
  winConditions: string[];
  lossConditions: string[];
  waveBased?: boolean;
  playerLives?: number;
}

export interface AudioSpec {
  hasBackgroundMusic: boolean;
  hasSoundEffects: boolean;
  hasAmbientSound: boolean;
  musicStyle?: string;         // e.g. "chiptune", "orchestral", "ambient"
}

export interface ControlSpec {
  keyboard: boolean;
  gamepad: boolean;
  touch: boolean;
  primaryControls: {
    move?: string;             // e.g. "WASD", "Arrow Keys"
    action?: string;           // e.g. "Space", "Z"
    pause?: string;
  };
}

export interface DeploymentSpec {
  targetUrl?: string;
  exportFormats: ("zip" | "blueprint" | "assets")[];
}

export interface ProjectBlueprint {
  title: string;
  genre: string;
  artStyle: "pixel" | "vector" | "hand_drawn" | "minimal";
  gameplay: GameplaySpec;
  audio: AudioSpec;
  controls: ControlSpec;
  deployment: DeploymentSpec;
}

// ---------------------------------------------------------------------------
// Build Status (§8)
// ---------------------------------------------------------------------------

export type BuildPhase =
  | "director"
  | "generation"
  | "assembly"
  | "verification"
  | "debugging"
  | "completed"
  | "failed";

export interface BuildStatus {
  projectId: string;
  phase: BuildPhase;
  progress: number;            // 0–100
  message?: string;
  errors?: RuntimeError[];
  updatedAt: string;           // ISO timestamp
}

// ---------------------------------------------------------------------------
// Runtime Error (DB Schema §10)
// ---------------------------------------------------------------------------

export interface RuntimeError {
  id: string;
  projectId: string;
  stacktrace: string;
  filePath: string;
  errorType: "console_error" | "uncaught_exception" | "network_failure" | "webgl_error" | "build_failure";
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Agent Run (DB Schema §10)
// ---------------------------------------------------------------------------

export type AgentName = "director" | "mechanics" | "asset" | "audio" | "debugger";
export type AgentRunStatus = "pending" | "running" | "completed" | "failed";

export interface AgentRun {
  id: string;
  projectId: string;
  agentName: AgentName;
  status: AgentRunStatus;
  output: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
}

// ---------------------------------------------------------------------------
// Project (DB Schema §10)
// ---------------------------------------------------------------------------

export type ProjectStatus =
  | "pending"
  | "clarifying"
  | "generating"
  | "assembling"
  | "verifying"
  | "debugging"
  | "completed"
  | "failed";

export interface Project {
  id: string;
  prompt: string;
  blueprint?: ProjectBlueprint;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// API Request/Response types (SRS §9)
// ---------------------------------------------------------------------------

export interface CreateProjectRequest {
  prompt: string;
}

export interface CreateProjectResponse {
  projectId: string;
}

export interface GetProjectResponse {
  project: Project;
  buildStatus: BuildStatus;
}

export interface GetLogsResponse {
  projectId: string;
  logs: LogEntry[];
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  source: AgentName | "orchestrator" | "build" | "verification";
  message: string;
  data?: unknown;
}
