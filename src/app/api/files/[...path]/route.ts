/*
Sitepaige v1.0.0
File serving API route - serves files stored via store_file function
SECURITY: This route is designed to only serve files from the designated files directory
*/

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { lookup } from 'mime-types';

/**
 * Get the files storage path
 * Uses EFS_MOUNT_PATH for production (in container with EFS) or SQLITE_DIR for local development
 */
function getFilesStoragePath(): string {
  const efsMountPath = process.env.EFS_MOUNT_PATH;
  const sqliteDir = process.env.SQLITE_DIR || '.';
  
  if (efsMountPath) {
    // In production with EFS
    return path.join(efsMountPath, 'files');
  } else {
    // In local development - use a separate files directory
    return path.join(sqliteDir, 'files');
  }
}

/**
 * Validate that a path is safe and within the files directory
 * @param requestedPath The path segments from the URL
 * @returns The safe, resolved file path or null if invalid
 */
function validateAndResolvePath(requestedPath: string[]): string | null {
  // Reject if no path provided
  if (!requestedPath || requestedPath.length === 0) {
    return null;
  }

  // Filter out any dangerous path segments
  const safePath = requestedPath.filter(segment => {
    // Reject any segment that:
    // - Is empty
    // - Contains '..' (parent directory traversal)
    // - Contains '.' at the start (hidden files)
    // - Contains path separators
    // - Contains null bytes
    if (!segment || 
        segment === '..' || 
        segment === '.' ||
        segment.startsWith('.') ||
        segment.includes('/') || 
        segment.includes('\\') ||
        segment.includes('\0')) {
      return false;
    }
    return true;
  });

  // If any segments were filtered out, reject the request
  if (safePath.length !== requestedPath.length) {
    return null;
  }

  // Build the full path
  const basePath = getFilesStoragePath();
  const fullPath = path.join(basePath, ...safePath);

  // CRITICAL SECURITY CHECK: Ensure the resolved path is within the files directory
  // This prevents directory traversal attacks
  const resolvedBase = path.resolve(basePath);
  const resolvedFull = path.resolve(fullPath);
  
  if (!resolvedFull.startsWith(resolvedBase)) {
    return null;
  }

  // Additional check: ensure we're not accessing the parent directory
  // The database is stored one level up, so we must never serve from there
  const parentDir = path.dirname(resolvedBase);
  if (resolvedFull.startsWith(parentDir) && !resolvedFull.startsWith(resolvedBase)) {
    return null;
  }

  return resolvedFull;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Validate and resolve the file path
    const filePath = validateAndResolvePath(params.path);
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Try to read the file
    try {
      const fileBuffer = await readFile(filePath);
      
      // Determine content type from file extension
      const contentType = lookup(filePath) || 'application/octet-stream';
      
      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year since files are immutable
        },
      });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File not found
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 