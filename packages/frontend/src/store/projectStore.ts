/**
 * VibeStudio AI — Global State Store (Zustand)
 * Implements SRS FR-1, FR-2, FR-10 state management
 */
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BuildPhase =
  | 'idle'
  | 'director'
  | 'generation'
  | 'assembly'
  | 'verification'
  | 'debugging'
  | 'completed'
  | 'failed'

export interface ClarificationQuestion {
  id: string
  question: string
  options?: string[]
  required: boolean
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  source: string
  message: string
}

export interface ProjectState {
  // Project
  projectId: string | null
  prompt: string

  // Build state
  phase: BuildPhase
  progress: number         // 0–100
  phaseMessage: string

  // Clarification (FR-2)
  clarificationQuestions: ClarificationQuestion[]
  clarificationAnswers: Record<string, string>
  clarificationComplete: boolean

  // Logs
  logs: LogEntry[]

  // Game preview
  gameUrl: string | null
  downloadUrl: string | null

  // UI
  isLoading: boolean
  error: string | null
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface ProjectActions {
  setPrompt: (prompt: string) => void
  startProject: (projectId: string) => void
  setPhase: (phase: BuildPhase, message?: string, progress?: number) => void
  setProgress: (progress: number) => void
  setClarificationQuestions: (questions: ClarificationQuestion[]) => void
  answerQuestion: (questionId: string, answer: string) => void
  completeClarification: () => void
  addLog: (entry: LogEntry) => void
  clearLogs: () => void
  setGameUrl: (url: string) => void
  setDownloadUrl: (url: string) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const initialState: ProjectState = {
  projectId: null,
  prompt: '',
  phase: 'idle',
  progress: 0,
  phaseMessage: '',
  clarificationQuestions: [],
  clarificationAnswers: {},
  clarificationComplete: false,
  logs: [],
  gameUrl: null,
  downloadUrl: null,
  isLoading: false,
  error: null,
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectState & ProjectActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setPrompt: (prompt) => set({ prompt }),

      startProject: (projectId) =>
        set({ projectId, phase: 'director', progress: 5, phaseMessage: 'Director Agent analyzing your prompt…' }),

      setPhase: (phase, message = '', progress) =>
        set((s) => ({
          phase,
          phaseMessage: message,
          progress: progress ?? s.progress,
        })),

      setProgress: (progress) => set({ progress }),

      setClarificationQuestions: (questions) =>
        set({ clarificationQuestions: questions, clarificationComplete: questions.length === 0 }),

      answerQuestion: (questionId, answer) =>
        set((s) => ({
          clarificationAnswers: { ...s.clarificationAnswers, [questionId]: answer },
        })),

      completeClarification: () =>
        set({ clarificationComplete: true, phase: 'generation', progress: 20, phaseMessage: 'Spawning agents…' }),

      addLog: (entry) =>
        set((s) => ({ logs: [...s.logs.slice(-499), entry] })),   // cap at 500 entries

      clearLogs: () => set({ logs: [] }),

      setGameUrl: (url) => set({ gameUrl: url, phase: 'completed', progress: 100 }),

      setDownloadUrl: (url) => set({ downloadUrl: url }),

      setError: (error) => set({ error, phase: error ? 'failed' : 'idle', isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      reset: () => set(initialState),
    }),
    { name: 'vibestudio-project' }
  )
)

// ---------------------------------------------------------------------------
// Phase display helpers
// ---------------------------------------------------------------------------

export const PHASE_LABELS: Record<BuildPhase, string> = {
  idle:         'Ready',
  director:     'Analyzing Prompt',
  generation:   'Generating Code',
  assembly:     'Assembling Project',
  verification: 'Running Diagnostics',
  debugging:    'Auto-Fixing Errors',
  completed:    'Game Ready!',
  failed:       'Build Failed',
}

export const PHASE_PROGRESS: Record<BuildPhase, number> = {
  idle:         0,
  director:     10,
  generation:   35,
  assembly:     60,
  verification: 75,
  debugging:    85,
  completed:    100,
  failed:       100,
}
