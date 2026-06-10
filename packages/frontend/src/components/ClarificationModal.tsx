/**
 * ClarificationModal — FR-2: Interactive Clarification Workflow
 * Director Agent asks follow-up questions to refine requirements
 */
import { useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { MessageSquare, ChevronRight, Check, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function ClarificationModal() {
  const {
    clarificationQuestions,
    clarificationAnswers,
    clarificationComplete,
    answerQuestion,
    completeClarification,
    isLoading,
  } = useProjectStore()

  const [currentIdx, setCurrentIdx] = useState(0)

  if (clarificationComplete || clarificationQuestions.length === 0) return null

  const current = clarificationQuestions[currentIdx]
  const isLast = currentIdx === clarificationQuestions.length - 1
  const currentAnswer = clarificationAnswers[current.id]
  const allRequired = clarificationQuestions
    .filter((q) => q.required)
    .every((q) => clarificationAnswers[q.id])

  const handleNext = () => {
    if (isLast) {
      completeClarification()
    } else {
      setCurrentIdx((i) => i + 1)
    }
  }

  const handleSkip = () => {
    if (isLast) completeClarification()
    else setCurrentIdx((i) => i + 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg shadow-2xl shadow-black/60 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <MessageSquare className="w-4.5 h-4.5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Director Agent</h2>
            <p className="text-xs text-white/40">Clarifying your game concept</p>
          </div>
          {/* Progress dots */}
          <div className="ml-auto flex gap-1.5">
            {clarificationQuestions.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-1.5 h-1.5 rounded-full transition-all duration-300',
                  i < currentIdx
                    ? 'bg-accent-green'
                    : i === currentIdx
                    ? 'bg-brand-400 w-4'
                    : 'bg-white/20'
                )}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <p className="label-xs mb-2">
            Question {currentIdx + 1} of {clarificationQuestions.length}
            {current.required && <span className="text-accent-red ml-1">*</span>}
          </p>
          <h3 className="text-lg font-semibold text-white mb-5">{current.question}</h3>

          {/* Option buttons */}
          {current.options && (
            <div className="grid grid-cols-2 gap-2">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  id={`option-${current.id}-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => answerQuestion(current.id, opt)}
                  className={clsx(
                    'px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200',
                    currentAnswer === opt
                      ? 'bg-brand-500/20 border-brand-500/60 text-brand-300'
                      : 'bg-surface-700/50 border-white/[0.08] text-white/70 hover:text-white hover:border-white/20 hover:bg-surface-600/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      'w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0',
                      currentAnswer === opt ? 'border-brand-400 bg-brand-400' : 'border-white/20'
                    )}>
                      {currentAnswer === opt && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    {opt}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-0">
          {!current.required && (
            <button onClick={handleSkip} className="btn-ghost text-white/40">
              Skip
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={handleNext}
              disabled={current.required && !currentAnswer || isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLast && allRequired ? 'Start Generation' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
