/**
 * ErrorBanner — displays build errors with retry option
 */
import { useProjectStore } from '@/store/projectStore'
import { AlertTriangle, X, RefreshCw } from 'lucide-react'

export function ErrorBanner() {
  const { error, setError, reset } = useProjectStore()

  if (!error) return null

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-accent-red/10 border border-accent-red/25">
        <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-accent-red mb-0.5">Build Error</p>
          <p className="text-sm text-white/60 break-all">{error}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={reset}
            className="btn-ghost text-accent-red/80 hover:text-accent-red text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
          <button
            onClick={() => setError(null)}
            className="btn-icon text-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
