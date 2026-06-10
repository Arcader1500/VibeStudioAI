/**
 * BuildProgress — FR-1: Live Build Progress Visualization
 * Shows the current build phase, progress bar, and logs
 */
import { useProjectStore, PHASE_LABELS, BuildPhase } from '@/store/projectStore'
import {
  Brain, Code2, Layers, TestTube2, Bug, CheckCircle2,
  XCircle, Terminal, ChevronDown
} from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'

const PHASE_ICONS: Record<BuildPhase, React.ElementType> = {
  idle:         Brain,
  director:     Brain,
  generation:   Code2,
  assembly:     Layers,
  verification: TestTube2,
  debugging:    Bug,
  completed:    CheckCircle2,
  failed:       XCircle,
}

const PHASE_COLORS: Record<BuildPhase, string> = {
  idle:         'text-white/40',
  director:     'text-brand-400',
  generation:   'text-accent-cyan',
  assembly:     'text-accent-purple',
  verification: 'text-accent-amber',
  debugging:    'text-accent-red',
  completed:    'text-accent-green',
  failed:       'text-accent-red',
}

const PHASES_ORDERED: BuildPhase[] = [
  'director', 'generation', 'assembly', 'verification', 'debugging', 'completed'
]

function PhaseStep({ phase, current }: { phase: BuildPhase; current: BuildPhase }) {
  const Icon = PHASE_ICONS[phase]
  const phases = PHASES_ORDERED
  const currentIdx = phases.indexOf(current)
  const phaseIdx = phases.indexOf(phase)
  const isDone = phaseIdx < currentIdx || current === 'completed'
  const isActive = phase === current
  const isPending = phaseIdx > currentIdx && current !== 'completed'

  return (
    <div className={clsx('flex items-center gap-2.5', isPending && 'opacity-35')}>
      <div className={clsx(
        'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500',
        isDone
          ? 'bg-accent-green/20 text-accent-green'
          : isActive
          ? 'bg-brand-500/20 text-brand-400 animate-pulse-slow'
          : 'bg-surface-600/50 text-white/30'
      )}>
        {isDone
          ? <CheckCircle2 className="w-3.5 h-3.5" />
          : <Icon className="w-3.5 h-3.5" />
        }
      </div>
      <span className={clsx(
        'text-sm font-medium transition-colors duration-300',
        isDone ? 'text-accent-green' : isActive ? 'text-white' : 'text-white/30'
      )}>
        {PHASE_LABELS[phase]}
      </span>
    </div>
  )
}

export function BuildProgress() {
  const { phase, progress, phaseMessage, logs, projectId } = useProjectStore()
  const [logsExpanded, setLogsExpanded] = useState(false)

  if (phase === 'idle') return null

  const Icon = PHASE_ICONS[phase]
  const colorClass = PHASE_COLORS[phase]
  const isComplete = phase === 'completed'
  const isFailed = phase === 'failed'

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up space-y-4">
      {/* Main status card */}
      <div className="glass-card p-6">
        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              isComplete ? 'bg-accent-green/20' : isFailed ? 'bg-accent-red/20' : 'bg-brand-500/15'
            )}>
              <Icon className={clsx('w-5 h-5', colorClass)} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{PHASE_LABELS[phase]}</h2>
              <p className="text-xs text-white/40 mt-0.5 max-w-xs truncate">
                {phaseMessage || (projectId ? `Project: ${projectId.slice(0, 8)}…` : '')}
              </p>
            </div>
          </div>
          <span className={clsx('text-2xl font-bold tabular-nums', colorClass)}>
            {progress}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-track mb-6">
          <div
            className={clsx(
              'progress-fill',
              isFailed && 'bg-gradient-to-r from-accent-red to-accent-amber',
              isComplete && 'bg-gradient-to-r from-accent-green to-accent-cyan'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Phase steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
          {PHASES_ORDERED.filter(p => p !== 'debugging' || phase === 'debugging' || phase === 'failed').map((p) => (
            <PhaseStep key={p} phase={p} current={phase} />
          ))}
        </div>
      </div>

      {/* Logs panel */}
      {logs.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setLogsExpanded(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium text-white/70">Build Logs</span>
              <span className="badge-blue ml-1 text-[10px] py-0.5">{logs.length}</span>
            </div>
            <ChevronDown className={clsx('w-4 h-4 text-white/30 transition-transform', logsExpanded && 'rotate-180')} />
          </button>

          {logsExpanded && (
            <div className="border-t border-white/[0.05] p-4 max-h-64 overflow-y-auto no-scrollbar">
              <div className="space-y-1 font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-white/25 flex-shrink-0 tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className={clsx(
                      'flex-shrink-0 w-12',
                      log.level === 'error' ? 'text-accent-red' :
                      log.level === 'warn'  ? 'text-accent-amber' :
                      log.level === 'debug' ? 'text-white/30' :
                      'text-brand-400'
                    )}>
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="text-white/60 break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
