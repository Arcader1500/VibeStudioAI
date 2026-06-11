import { useProjectStore } from '@/store/projectStore'

export function SettingsModal() {
  const { aiProvider, setAiProvider, openRouterKey, setOpenRouterKey, setShowSettings } = useProjectStore()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e24] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">AI Configuration</h2>
          <button 
            onClick={() => setShowSettings(false)}
            className="text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">OpenRouter API Key</label>
            <input 
              type="password" 
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors"
            />
            <p className="text-xs text-white/40">Stored locally in your browser.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Preferred Model</label>
            <select 
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-purple transition-colors appearance-none"
            >
              <option value="auto">Auto (Smart Fallback Chain)</option>
              <option value="deepseek">DeepSeek V4 Flash</option>
              <option value="gemini">Google Gemini Pro 1.5</option>
              <option value="claude">Anthropic Claude 3.5 Sonnet</option>
              <option value="gpt">OpenAI GPT-4o</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end">
          <button 
            onClick={() => setShowSettings(false)}
            className="bg-brand-purple hover:bg-brand-purple/80 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}
