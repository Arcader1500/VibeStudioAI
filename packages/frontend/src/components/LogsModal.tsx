import { useProjectStore } from '@/store/projectStore'
import { Terminal, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function LogsModal() {
  const { logs, showLogsModal, setShowLogsModal } = useProjectStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, showLogsModal])

  if (!showLogsModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-white">
            <Terminal className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-semibold tracking-tight">Development Logs</h2>
          </div>
          <button 
            onClick={() => setShowLogsModal(false)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Log content */}
        <div 
          ref={scrollRef}
          className="flex-1 p-5 overflow-y-auto font-mono text-xs text-white/70 space-y-1.5 bg-[#0a0a0a]"
        >
          {logs.length === 0 ? (
            <div className="text-white/30 italic">No logs emitted yet...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={`flex gap-3 leading-relaxed ${log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : ''}`}>
                <span className="opacity-50 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="opacity-50 shrink-0 w-24">[{log.source}]</span>
                <span className="break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
