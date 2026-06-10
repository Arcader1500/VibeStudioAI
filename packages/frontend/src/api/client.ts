/**
 * VibeStudio AI — API Client
 * Implements SRS §9 API endpoints
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err?.error ?? `HTTP ${res.status}`)
  }

  return res.json()
}

// ---------------------------------------------------------------------------
// POST /projects  (FR-1)
// ---------------------------------------------------------------------------
export async function createProject(prompt: string): Promise<{ projectId: string }> {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
}

// ---------------------------------------------------------------------------
// GET /projects/:id
// ---------------------------------------------------------------------------
export async function getProject(id: string) {
  return request<{
    project: { id: string; prompt: string; status: string; blueprint: unknown }
    buildStatus: { phase: string; progress: number; message?: string }
  }>(`/projects/${id}`)
}

// ---------------------------------------------------------------------------
// GET /projects/:id/logs
// ---------------------------------------------------------------------------
export async function getProjectLogs(id: string) {
  return request<{ projectId: string; logs: unknown[] }>(`/projects/${id}/logs`)
}

// ---------------------------------------------------------------------------
// GET /projects/:id/download  (FR-12)
// ---------------------------------------------------------------------------
export function getDownloadUrl(id: string): string {
  return `${BASE_URL}/projects/${id}/download`
}

// ---------------------------------------------------------------------------
// WebSocket live log stream (future: 1C.7)
// ---------------------------------------------------------------------------
export function connectLiveStream(
  projectId: string,
  onMessage: (data: unknown) => void,
  onError?: (e: Event) => void
): () => void {
  const wsBase = BASE_URL.replace(/^http/, 'ws')
  const ws = new WebSocket(`${wsBase}/projects/${projectId}/stream`)

  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)) } catch { /* non-JSON frame, ignore */ }
  }
  ws.onerror = onError ?? (() => {})

  return () => ws.close()
}
