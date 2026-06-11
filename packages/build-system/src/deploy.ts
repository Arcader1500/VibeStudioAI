/**
 * Cloud Deployment Utilities
 * Implements SRS Phase 7 — §11 (Cloud storage & one-click deployment)
 */

import path from 'path';
import fs from 'fs';

/**
 * Mocks an upload of the build directory to an S3-compatible cloud storage provider.
 * In a production environment, this would use the aws-sdk or a Vercel/Netlify API.
 * For the MVP, this simulates the upload delay and returns a placeholder URL.
 */
export async function uploadToCloud(buildDir: string): Promise<string> {
  const isProd = process.env.NODE_ENV === 'production';
  const bucketName = process.env.S3_BUCKET_NAME || 'vibestudio-games-dev';

  // Basic validation to ensure we have something to deploy
  if (!fs.existsSync(buildDir)) {
    throw new Error(`Deployment failed: Directory ${buildDir} does not exist.`);
  }

  // Simulate network upload time (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const gameId = path.basename(path.dirname(buildDir)); // e.g. /tmp/.../game-id/dist -> game-id
  
  if (isProd) {
    return `https://${bucketName}.s3.amazonaws.com/${gameId}/index.html`;
  }

  // Return a local testing URL
  return `http://localhost:8080/${gameId}/index.html`;
}
