/**
 * Runtime Verification Agent
 * Implements SRS Phase 4 — FR-10, §4.D
 *
 * Uses Playwright headless Chromium to automate a run of the generated game
 * and gather telemetry: console errors, unhandled exceptions, network failures,
 * and visual screenshots.
 */

import { chromium, type Page, type ConsoleMessage } from 'playwright';

export interface TelemetryReport {
  success: boolean;
  errors: {
    type: 'console' | 'exception' | 'network' | 'webgl';
    message: string;
    stack?: string;
  }[];
  warnings: string[];
  screenshotBase64?: string;
  durationMs: number;
}

export interface VerificationOptions {
  url: string;                  // Target dev server URL
  observationTimeMs?: number;   // Time to wait and observe (default 5000)
  captureScreenshot?: boolean;  // Whether to capture a final screenshot
}

// ---------------------------------------------------------------------------
// FR-10: Automated game launch and observation
// ---------------------------------------------------------------------------

export async function runVerification(opts: VerificationOptions): Promise<TelemetryReport> {
  const { url, observationTimeMs = 5000, captureScreenshot = true } = opts;
  const startTime = Date.now();
  
  const report: TelemetryReport = {
    success: true,
    errors: [],
    warnings: [],
    durationMs: 0,
  };

  // 1. Launch Playwright headless Chromium
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
  });
  const page = await context.newPage();

  // 2. Set up telemetry listeners (FR-10 capture points)
  
  // A. Console errors
  page.on('console', (msg: ConsoleMessage) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      // Special WebGL classification
      if (text.includes('WebGL') || text.includes('GL_INVALID_')) {
        report.errors.push({ type: 'webgl', message: text });
      } else {
        report.errors.push({ type: 'console', message: text });
      }
    } else if (msg.type() === 'warning') {
      report.warnings.push(text);
    }
  });

  // B. Uncaught exceptions
  page.on('pageerror', (err: Error) => {
    report.errors.push({
      type: 'exception',
      message: err.message,
      stack: err.stack,
    });
  });

  // C. Failed network requests
  page.on('requestfailed', (request) => {
    report.errors.push({
      type: 'network',
      message: `Request failed: ${request.url()} - ${request.failure()?.errorText}`,
    });
  });

  try {
    // 3. Load game URL and wait for DOM loaded
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Attempt to click canvas to start audio context (required by modern browsers)
    try {
      await page.waitForSelector('canvas', { timeout: 3000 });
      await page.click('canvas', { force: true });
    } catch {
      report.warnings.push('No canvas element found or not clickable within 3 seconds');
    }

    // 4. Observation window (FR-10: 5-second wait)
    await page.waitForTimeout(observationTimeMs);

    // 5. Capture visual output (FR-10: Screenshots)
    if (captureScreenshot) {
      const buffer = await page.screenshot({ type: 'jpeg', quality: 80 });
      report.screenshotBase64 = buffer.toString('base64');
    }

  } catch (error) {
    // Top-level navigation or Playwright error
    report.errors.push({
      type: 'exception',
      message: `Failed to load game URL: ${error instanceof Error ? error.message : String(error)}`,
    });
  } finally {
    // Cleanup
    await page.close();
    await context.close();
    await browser.close();
  }

  // Determine success based on presence of severe errors
  // Warnings don't fail the build
  report.success = report.errors.length === 0;
  report.durationMs = Date.now() - startTime;

  return report;
}
