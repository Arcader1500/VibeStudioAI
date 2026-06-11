/**
 * Navbar — top navigation bar
 */
import { Github, Zap, BookOpen, Settings, Gamepad2, Terminal } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

export function Navbar() {
  const { setShowSettings, setView, setShowLogsModal, view } = useProjectStore()
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-surface-900/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setView('home')} className="flex items-center gap-2.5 group" id="nav-logo">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/40 transition-all duration-300">
            <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            VibeStudio <span className="text-brand-400">AI</span>
          </span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <a
            href="/docs/ProjectSRS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-white/50 hidden sm:inline-flex"
            id="nav-docs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Docs</span>
          </a>
          <button
            onClick={() => setView(view === 'home' ? 'past_games' : 'home')}
            className="btn-ghost text-white/50"
            id="nav-past-games"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:block">{view === 'home' ? 'Past Games' : 'Generator'}</span>
          </button>
          <button
            onClick={() => setShowLogsModal(true)}
            className="btn-ghost text-white/50"
            id="nav-logs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Logs</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="btn-ghost text-white/50"
            id="nav-settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Settings</span>
          </button>
          <a
            href="https://github.com/Arcader1500/VibeStudioAI"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-white/50"
            id="nav-github"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:block">GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
