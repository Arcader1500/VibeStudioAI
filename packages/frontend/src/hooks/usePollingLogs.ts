import { useProjectStore } from '@/store/projectStore'
import { getProjectLogs, getProject } from '@/api/client'
import { useEffect } from 'react'

export function usePollingLogs() {
  const { projectId, phase, addLog, logs } = useProjectStore()

  useEffect(() => {
    if (!projectId || phase === 'idle' || phase === 'completed' || phase === 'failed') return

    const interval = setInterval(async () => {
      try {
        const data = await getProjectLogs(projectId)
        const newLogs = data.logs || []
        
        // Very basic sync: just push logs we haven't seen.
        // We match on timestamp+message stringification for simplicity.
        const existingSet = new Set(logs.map(l => l.timestamp + l.message))
        
        newLogs.forEach((l: any) => {
          if (!existingSet.has(l.timestamp + l.message)) {
            addLog({
              timestamp: l.timestamp,
              level: l.level || 'info',
              source: 'Orchestrator',
              message: l.message
            })
          }
        })
      } catch (e) {
        // ignore fetch errors during polling
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [projectId, phase, logs])
}
