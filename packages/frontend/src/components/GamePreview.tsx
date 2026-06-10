/**
 * GamePreview — Game iframe panel + Download (FR-12)
 */
import { useProjectStore } from '@/store/projectStore'
import { getDownloadUrl } from '@/api/client'
import {
  Gamepad2, Download, ExternalLink, RotateCcw, Maximize2,
  Code2, FileArchive, BookOpen
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export function GamePreview() {
  const { phase, gameUrl, projectId, downloadUrl, reset } = useProjectStore()
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (phase !== 'completed' || !gameUrl) return null

  const dlUrl = downloadUrl ?? (projectId ? getDownloadUrl(projectId) : null)

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-green/20 flex items-center justify-center">
            <Gamepad2 className="w-4.5 h-4.5 text-accent-green" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Your Game is Ready!</h2>
            <p className="text-xs text-white/40">Play directly in the browser</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(v => !v)}
            className="btn-icon"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={reset}
            className="btn-ghost text-white/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Game
          </button>
        </div>
      </div>

      {/* Game iframe */}
      <div className={clsx(
        'glass-card overflow-hidden transition-all duration-500',
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : 'relative'
      )}>
        <iframe
          src={gameUrl}
          title="Generated Game Preview"
          className="w-full border-0"
          style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : '540px' }}
          allow="autoplay"
          sandbox="allow-scripts allow-same-origin"
        />
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-3 right-3 btn-secondary py-1.5 text-xs"
          >
            Exit Fullscreen
          </button>
        )}
      </div>

      {/* Export actions — FR-12 */}
      <div className="glass-card p-5">
        <p className="label-xs mb-4">Export Options</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dlUrl && (
            <a
              href={dlUrl}
              download
              className="btn-primary justify-center"
              id="download-source-zip"
            >
              <FileArchive className="w-4 h-4" />
              Download ZIP
            </a>
          )}
          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary justify-center"
            id="open-game-new-tab"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Tab
          </a>
          <button
            className="btn-secondary justify-center"
            id="view-source-code"
            onClick={() => {/* TODO: open source viewer */}}
          >
            <Code2 className="w-4 h-4" />
            View Source
          </button>
        </div>

        <div className="divider my-4" />

        <div className="flex items-center gap-2 text-xs text-white/30">
          <BookOpen className="w-3.5 h-3.5" />
          Source is pure HTML/JS — open <code className="font-mono text-white/50">index.html</code> in any browser
        </div>
      </div>
    </div>
  )
}
