/**
 * VibeStudio AI — App Root
 * Orchestrates all views: idle → clarification → building → preview
 */
import { useProjectStore } from '@/store/projectStore'
import { Navbar }            from '@/components/Navbar'
import { PromptInput }       from '@/components/PromptInput'
import { ClarificationModal } from '@/components/ClarificationModal'
import { BuildProgress }     from '@/components/BuildProgress'
import { GamePreview }       from '@/components/GamePreview'
import { ErrorBanner }       from '@/components/ErrorBanner'

// Feature cards shown on the idle screen
const FEATURES = [
  { icon: '🧠', title: 'Director Agent', desc: 'Clarifies your idea and produces a structured game blueprint' },
  { icon: '⚙️', title: 'Mechanics Agent', desc: 'Generates Phaser 3 gameplay — physics, combat, input, and scenes' },
  { icon: '🎨', title: 'Asset Agent', desc: 'Creates pixel-art sprites, tiles, and effects — no external assets' },
  { icon: '🎵', title: 'Audio Agent', desc: 'Procedural music and SFX via Web Audio API — zero downloads' },
  { icon: '🔍', title: 'Runtime Verifier', desc: 'Runs Playwright to catch console errors and rendering failures' },
  { icon: '🩺', title: 'Debugger Agent', desc: 'Auto-generates patches and retries until the game runs cleanly' },
]

export default function App() {
  const { phase, clarificationQuestions, clarificationComplete } = useProjectStore()

  const isIdle        = phase === 'idle'
  const isBuilding    = !isIdle && phase !== 'completed' && phase !== 'failed'
  const showClarify   = clarificationQuestions.length > 0 && !clarificationComplete
  const isComplete    = phase === 'completed'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-12 gap-10">
        {/* Error banner — always on top */}
        <ErrorBanner />

        {/* Idle — prompt input */}
        {isIdle && <PromptInput />}

        {/* Building — progress visualization */}
        {isBuilding && <BuildProgress />}

        {/* Completed — game preview */}
        {isComplete && <GamePreview />}

        {/* Idle — feature showcase grid */}
        {isIdle && (
          <section className="w-full max-w-3xl mt-4">
            <p className="label-xs text-center mb-6">How it works</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="glass-card-hover p-5">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-10 text-center text-xs text-white/20">
          <p>
            VibeStudio AI — Open Source •{' '}
            <a
              href="https://github.com/Arcader1500/VibeStudioAI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/50 transition-colors"
            >
              GitHub
            </a>{' '}
            • MIT License
          </p>
        </footer>
      </main>

      {/* Clarification overlay — FR-2 */}
      {showClarify && <ClarificationModal />}
    </div>
  )
}
