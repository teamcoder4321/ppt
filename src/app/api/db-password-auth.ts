/*
 * Username/Password Authentication Database Utilities
 * Handles all database operations related to username/password authentication
 */

import { db_init, db_query } from './db';
import type { DatabaseClient } from './db';
import * as crypto from 'node:crypto';
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export interface PasswordAuth {
  id: string;
  email: string; // Email serves as username
  passwordhash: string;
  salt: string;
  verificationtoken?: string;
  verificationtokenexpires?: string;
  emailverified: boolean;
  resettoken?: string;
  resettokenexpires?: string;
  createdat: string;
  updatedat: string;
}

/**
 * Hash a password using scrypt
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(32).toString('base64');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return {
    hash: hash.toString('base64'),
    salt
  };
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return derivedKey.toString('base64') === hash;
}

/**
 * Create the password authentication table
 */
export async function createPasswordAuthTable(): Promise<void> {
  const client = await db_init();
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS passwordauth (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      passwordhash TEXT NOT NULL,
      salt TEXT NOT NULL,
      verificationtoken TEXT,
      verificationtokenexpires TIMESTAMP,
      emailverified BOOLEAN DEFAULT FALSE,
      resettoken TEXT,
      resettokenexpires TIMESTAMP,
      createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await db_query(client, createTableQuery);
  
  // Create index on email for faster lookups
  await db_query(client, 'CREATE INDEX IF NOT EXISTS idx_passwordauth_email ON passwordauth(email)');
  await db_query(client, 'CREATE INDEX IF NOT EXISTS idx_passwordauth_verification_token ON passwordauth(verificationtoken)');
  await db_query(client, 'CREATE INDEX IF NOT EXISTS idx_passwordauth_reset_token ON passwordauth(resettoken)');
}

/**
 * Get password auth record by email
 */
export async function getPasswordAuthByEmail(email: string): Promise<PasswordAuth | null> {
  const client = await db_init();
  
  const results = await db_query(client, 
    "SELECT * FROM passwordauth WHERE email = ?",
    [email.toLowerCase()]
  );
  
  return results.length > 0 ? results[0] as PasswordAuth : null;
}

/**
 * Create a new password auth record (for signup)
 */
export async function createPasswordAuth(
  email: string,
  password: string
): Promise<{ passwordAuth: PasswordAuth; verificationToken: string }> {
  const client = await db_init();
  
  // Check if email already exists
  const existing = await getPasswordAuthByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }
  
  // Hash the password
  const { hash, salt } = await hashPassword(password);
  
  // Generate verification token
  const verificationToken = randomBytes(32).toString('base64url');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await db_query(client,
    `INSERT INTO passwordauth 
     (id, email, passwordhash, salt, verificationtoken, verificationtokenexpires, emailverified, createdat, updatedat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, email.toLowerCase(), hash, salt, verificationToken, verificationTokenExpires.toISOString(), false, now, now]
  );
  
  const passwordAuth = await getPasswordAuthByEmail(email);
  if (!passwordAuth) {
    throw new Error('Failed to create password auth record');
  }
  
  return { passwordAuth, verificationToken };
}

/**
 * Verify email with token
 */
export async function verifyEmailWithToken(token: string): Promise<PasswordAuth | null> {
  const client = await db_init();
  
  // Find the auth record with this token
  const results = await db_query(client,
    `SELECT * FROM passwordauth 
     WHERE verificationtoken = ? 
     AND verificationtokenexpires > CURRENT_TIMESTAMP 
     AND emailverified = false`,
    [token]
  );
  
  if (results.length === 0) {
    return null;
  }
  
  const authRecord = results[0];
  
  // Mark email as verified and clear token
  await db_query(client,
    `UPDATE passwordauth 
     SET emailverified = true, 
         verificationtoken = NULL, 
         verificationtokenexpires = NULL,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [authRecord.id]
  );
  
  return await getPasswordAuthByEmail(authRecord.email);
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<PasswordAuth | null> {
  const authRecord = await getPasswordAuthByEmail(email);
  
  if (!authRecord) {
    return null;
  }
  
  // Check if email is verified
  if (!authRecord.emailverified) {
    throw new Error('Email not verified');
  }
  
  // Verify password
  const isValid = await verifyPassword(password, authRecord.passwordhash, authRecord.salt);
  
  if (!isValid) {
    return null;
  }
  
  return authRecord;
}

/**
 * Generate password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  const client = await db_init();
  
  const authRecord = await getPasswordAuthByEmail(email);
  if (!authRecord) {
    return null;
  }
  
  const resetToken = randomBytes(32).toString('base64url');
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  await db_query(client,
    `UPDATE passwordauth 
     SET resettoken = ?, 
         resettokenexpires = ?,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [resetToken, resetTokenExpires.toISOString(), authRecord.id]
  );
  
  return resetToken;
}

/**
 * Reset password with token
 */
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const client = await db_init();
  
  // Find the auth record with this token
  const results = await db_query(client,
    `SELECT * FROM passwordauth 
     WHERE resettoken = ? 
     AND resettokenexpires > CURRENT_TIMESTAMP`,
    [token]
  );
  
  if (results.length === 0) {
    return false;
  }
  
  const authRecord = results[0];
  
  // Hash the new password
  const { hash, salt } = await hashPassword(newPassword);
  
  // Update password and clear reset token
  await db_query(client,
    `UPDATE passwordauth 
     SET passwordhash = ?, 
         salt = ?, 
         resettoken = NULL, 
         resettokenexpires = NULL,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [hash, salt, authRecord.id]
  );
  
  return true;
}

/**
 * Delete unverified accounts older than 7 days
 */
export async function cleanupUnverifiedAccounts(): Promise<number> {
  const client = await db_init();
  
  const result = await db_query(client,
    `DELETE FROM passwordauth 
     WHERE emailverified = false 
     AND createdat < datetime('now', '-7 days')`
  );
  
  return result[0]?.changes || 0;
}

/**
 * Update password for authenticated user
 */
export async function updatePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
  // First verify the current password
  const authRecord = await authenticateUser(email, currentPassword);
  if (!authRecord) {
    return false;
  }
  
  // Hash the new password
  const { hash, salt } = await hashPassword(newPassword);
  const client = await db_init();
  
  // Update password
  await db_query(client,
    `UPDATE passwordauth 
     SET passwordhash = ?, 
         salt = ?,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [hash, salt, authRecord.id]
  );
  
  return true;
}

/**
 * Regenerate email verification token for unverified accounts
 */
export async function regenerateVerificationToken(email: string): Promise<{ passwordAuth: PasswordAuth; verificationToken: string } | null> {
  const client = await db_init();
  
  const authRecord = await getPasswordAuthByEmail(email);
  if (!authRecord) {
    return null;
  }
  
  // Only regenerate for unverified accounts
  if (authRecord.emailverified) {
    throw new Error('Email is already verified');
  }
  
  // Generate new verification token
  const verificationToken = randomBytes(32).toString('base64url');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await db_query(client,
    `UPDATE passwordauth 
     SET verificationtoken = ?, 
         verificationtokenexpires = ?,
         updatedat = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [verificationToken, verificationTokenExpires.toISOString(), authRecord.id]
  );
  
  const updatedAuth = await getPasswordAuthByEmail(email);
  if (!updatedAuth) {
    throw new Error('Failed to update verification token');
  }
  
  return { passwordAuth: updatedAuth, verificationToken };
}

/**
 * Check if an email is already registered
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const authRecord = await getPasswordAuthByEmail(email);
  return authRecord !== null;
}

/**
 * Get statistics about password auth users
 */
export async function getPasswordAuthStats(): Promise<{
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}> {
  const client = await db_init();
  
  const stats = await db_query(client, `
    SELECT 
      COUNT(*) as totalUsers,
      SUM(CASE WHEN emailverified = true THEN 1 ELSE 0 END) as verifiedUsers,
      SUM(CASE WHEN emailverified = false THEN 1 ELSE 0 END) as unverifiedUsers
    FROM passwordauth
  `);
  
  return stats[0];
}
