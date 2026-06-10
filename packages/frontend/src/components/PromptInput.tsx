/**
 * PromptInput — FR-1: Accept natural language game description
 */
import { useState, useRef } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { createProject } from '@/api/client'
import { Sparkles, Wand2, ArrowRight, Loader2 } from 'lucide-react'

const EXAMPLE_PROMPTS = [
  'A top-down zombie survival game with pixel art and wave-based combat',
  'A side-scrolling platformer with a knight collecting coins through haunted castles',
  'A space shooter with asteroid fields, power-ups, and boss battles',
  'A puzzle game where you rotate blocks to guide a ball to the exit',
]

export function PromptInput() {
  const { prompt, setPrompt, isLoading, startProject, setError, setLoading, setClarificationQuestions, aiProvider, openRouterKey, setShowSettings } =
    useProjectStore()
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    setCharCount(e.target.value.length)
    // auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleExample = (ex: string) => {
    setPrompt(ex)
    setCharCount(ex.length)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    try {
      if (!openRouterKey && aiProvider !== 'auto') {
        // If they chose a specific provider but no key, warn them. Auto uses server key.
        setShowSettings(true)
        throw new Error('Please enter your OpenRouter API Key in settings first.')
      }

      setLoading(true)
      setError(null)
      const { projectId } = await createProject(prompt.trim(), { provider: aiProvider, key: openRouterKey })
      startProject(projectId)

      // TODO: Connect WebSocket for live updates
      // TODO: Director Agent will push clarification questions via WS
      // For now, simulate clarification phase
      setClarificationQuestions([
        { id: 'artStyle', question: 'What art style should the game use?', options: ['Pixel Art', 'Vector / Flat', 'Hand Drawn', 'Minimal / Geometric'], required: true },
        { id: 'camera', question: 'What camera perspective?', options: ["Top-Down (bird's eye)", 'Side Scroller', 'Isometric', 'Fixed Camera'], required: true },
        { id: 'difficulty', question: 'Difficulty level?', options: ['Easy', 'Medium', 'Hard'], required: false },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e as unknown as React.FormEvent)
  }

  const isValid = prompt.trim().length >= 10

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 badge-blue mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Game Generation</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-balance">
          Describe your{' '}
          <span className="gradient-text">dream game</span>
        </h1>
        <p className="text-lg text-white/50 max-w-xl mx-auto text-balance">
          Type a game concept in plain English. Our AI agents will generate the code,
          assets, audio, and a playable browser game — automatically.
        </p>
      </div>

      {/* Prompt form */}
      <form onSubmit={handleSubmit} className="glass-card p-1.5 shadow-2xl shadow-black/50">
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="prompt-input"
            value={prompt}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your game… e.g. 'A top-down zombie survival game with pixel art and wave-based combat'"
            className="w-full bg-transparent border-0 rounded-xl px-5 py-4 text-white placeholder-white/25 text-base resize-none min-h-[100px] max-h-[300px] focus:outline-none leading-relaxed"
            disabled={isLoading}
            aria-label="Game description prompt"
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <span className={`text-xs ${charCount > 800 ? 'text-accent-amber' : 'text-white/25'}`}>
              {charCount} chars
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/25 hidden sm:block">Ctrl+Enter to send</span>
              <button
                type="submit"
                id="submit-prompt"
                disabled={!isValid || isLoading}
                className="btn-primary py-2.5 px-5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Starting…</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Game</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Example prompts */}
      <div className="mt-5">
        <p className="label-xs text-center mb-3">Try an example</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              className="text-xs px-3.5 py-2 rounded-full bg-surface-700/60 border border-white/[0.07]
                         text-white/50 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10
                         transition-all duration-200 text-left"
              disabled={isLoading}
            >
              {ex.length > 55 ? ex.slice(0, 55) + '…' : ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
