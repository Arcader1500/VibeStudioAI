import { useEffect, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { getProject, type ProjectData } from '@/api/client' // Need to export type if possible, or fetch
import { Gamepad2, ArrowRight, Loader2 } from 'lucide-react'

// Basic fetch wrapper for /projects
async function fetchPastProjects() {
  const token = localStorage.getItem('VIBESTUDIO_API_KEY') || ''
  const res = await fetch(import.meta.env.VITE_API_URL + '/projects', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.projects || []
}

export function PastGames() {
  const { setView, startProject, setGameUrl } = useProjectStore()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPastProjects().then(data => {
      setProjects(data)
      setLoading(false)
    })
  }, [])

  const handleLaunch = async (projectId: string, status: string) => {
    if (status === 'completed') {
      // For MVP, the deployed game URL is predictable or we can fetch it
      // Let's just fetch the project details to see if it has a deploy URL,
      // but right now it just hosts it locally or uploads to S3.
      // We'll set the preview window to start the game.
      startProject(projectId)
      setGameUrl(`http://localhost:8080/${projectId}/index.html`) // Fallback local url
    } else {
      startProject(projectId)
    }
    setView('home')
  }

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-brand-400" /></div>
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Your Past Games</h2>
        <button onClick={() => setView('home')} className="btn-secondary py-2 px-4">
          Back to Generator
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-10 text-center text-white/50">
          <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You haven't generated any games yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="glass-card p-6 flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white capitalize">{p.prompt.split(' ').slice(0, 5).join(' ')}...</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{p.prompt}</p>
                <p className="text-xs text-white/30 mt-2">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => handleLaunch(p.id, p.status)}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  {p.status === 'completed' ? 'Launch Game' : 'Resume Build'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
