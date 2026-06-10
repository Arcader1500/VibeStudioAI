/**
 * Build Runner — executes pnpm install + pnpm dev (FR-9, FR-10)
 * Routes build failures to Debugger Agent (FR-11)
 */
import { execSync, spawn, type ChildProcess } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

export interface BuildResult {
  success: boolean
  stdout: string
  stderr: string
  exitCode: number
}

// ---------------------------------------------------------------------------
// FR-9: pnpm install + pnpm build
// ---------------------------------------------------------------------------

export function runInstall(projectDir: string): BuildResult {
  return runCommand('pnpm install', projectDir)
}

export function runBuild(projectDir: string): BuildResult {
  return runCommand('pnpm build', projectDir)
}

// ---------------------------------------------------------------------------
// FR-10: pnpm dev — returns child process handle and local URL
// ---------------------------------------------------------------------------

export interface DevServerHandle {
  process: ChildProcess
  url: string
  kill: () => void
}

export function startDevServer(
  projectDir: string,
  port = 8080,
  onReady?: (url: string) => void
): DevServerHandle {
  const url = `http://localhost:${port}`

  const child = spawn('pnpm', ['dev', '--port', String(port), '--host', 'false'], {
    cwd: projectDir,
    shell: true,
    stdio: 'pipe',
  })

  child.stdout?.on('data', (data: Buffer) => {
    const text = data.toString()
    if (text.includes('Local:') || text.includes('localhost')) {
      onReady?.(url)
    }
  })

  return {
    process: child,
    url,
    kill: () => child.kill(),
  }
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function runCommand(cmd: string, cwd: string): BuildResult {
  try {
    const stdout = execSync(cmd, { cwd, encoding: 'utf-8', timeout: 120_000 })
    return { success: true, stdout, stderr: '', exitCode: 0 }
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number }
    return {
      success: false,
      stdout: e.stdout ?? '',
      stderr: e.stderr ?? String(err),
      exitCode: e.status ?? 1,
    }
  }
}
