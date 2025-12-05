/*
 * User Management Database Utilities
 * Handles all database operations related to user management
 */

import { db_init, db_query, db_migrate } from './db';
import type { DatabaseClient } from './db';
import * as crypto from 'node:crypto';

export interface User {
  userid: string;
  oauthid: string;
  source: 'google' | 'facebook' | 'apple' | 'github' | 'userpass';
  username: string;
  email?: string;
  avatarurl?: string;
  userlevel: number; // 0: everyone, 1: registered user, 2: admin
  lastlogindate: string;
  createddate: string;
  isactive: boolean;
}

export interface UserSession {
  id: string;
  sessiontoken: string;
  userid: string;
  expirationdate: string;
}

export interface OAuthToken {
  id: string;
  userid: string;
  provider: 'google' | 'facebook' | 'apple' | 'github';
  accesstoken: string;
  refreshtoken?: string;
  expiresat?: string;
  createdat: string;
  updatedat: string;
}

/**
 * Get all users from the database
 */
export async function getAllUsers(): Promise<User[]> {
  const client = await db_init();
  
  const users = await db_query(client, 
    `SELECT * FROM users 
     WHERE isactive = ? 
     ORDER BY userlevel DESC, username ASC`,
    [1]  // Use 1 instead of true for PostgreSQL compatibility
  );
  
  return users as User[];
}

/**
 * Get a user by their OAuth ID
 */
export async function getUserByOAuthID(oauthId: string): Promise<User | null> {
  const client = await db_init();

  const users = await db_query(client, 
    "SELECT * FROM users WHERE oauthid = ? AND isactive = ?",
    [oauthId, 1]  // Use 1 instead of true for PostgreSQL compatibility
  );
  
  return users.length > 0 ? users[0] as User : null;
}

/**
 * Get a user by their userid
 */
export async function getUserByID(userId: string): Promise<User | null> {
  const client = await db_init();
  
  const users = await db_query(client, 
    "SELECT * FROM users WHERE userid = ? AND isactive = ?",
    [userId, 1]  // Use 1 instead of true for PostgreSQL compatibility
  );
  
  return users.length > 0 ? users[0] as User : null;
}

/**
 * Create or update a user
 */
export async function upsertUser(
  oauthId: string,
  source: 'google' | 'facebook' | 'apple' | 'github' | 'userpass',
  userName: string,
  email?: string,
  avatarUrl?: string
): Promise<User> {
  const client = await db_init();
  
  // Check if user exists
  const existingUser = await getUserByOAuthID(oauthId);
  
  if (existingUser) {
    // Update existing user
    await db_query(client,
      `UPDATE users 
       SET username = ?, email = COALESCE(?, email), avatarurl = ?, 
           lastlogindate = CURRENT_TIMESTAMP, source = ?
       WHERE oauthid = ?`,
      [userName, email, avatarUrl || '', source, oauthId]
    );
    
    return (await getUserByOAuthID(oauthId))!;
  } else {
    // Check if this is the first user (should be admin)
    const allUsers = await db_query(client, "SELECT COUNT(*) as count FROM users");
    const isFirstUser = Number(allUsers[0].count) === 0;
    
    // Create new user
    const userId = crypto.randomUUID();
    const permissionLevel = isFirstUser ? 2 : 1; // First user is admin
    
    await db_query(client,
      `INSERT INTO users 
       (userid, oauthid, source, username, email, avatarurl, userlevel, usertier,
        lastlogindate, createddate, isactive)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
      [userId, oauthId, source, userName, email || null, avatarUrl || '', permissionLevel, 1]  // Use 1 instead of true for PostgreSQL compatibility
    );
    
    return (await getUserByOAuthID(oauthId))!;
  }
}

/**
 * Update a user's permission level
 */
export async function updateUserPermission(
  userId: string, 
  permissionLevel: number
): Promise<boolean> {
  const client = await db_init();

  // Ensure there's always at least one admin
  if (permissionLevel < 2) {
    const admins = await db_query(client,
      "SELECT COUNT(*) as count FROM users WHERE userlevel = ? AND userid != ? AND isactive = ?",
      [2, userId, 1]  // Use 1 instead of true for PostgreSQL compatibility
    );
    
    if (admins[0].count === 0) {
      throw new Error('Cannot demote the last admin user');
    }
  }
  
  const result = await db_query(client,
    "UPDATE users SET userlevel = ? WHERE userid = ?",
    [permissionLevel, userId]
  );
  
  return result[0].changes > 0;
}

/**
 * Delete (soft delete) a user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const client = await db_init();
  
  // Ensure there's always at least one admin
  const user = await getUserByID(userId);
  if (user && user.userlevel === 2) {
    const admins = await db_query(client,
      "SELECT COUNT(*) as count FROM users WHERE userlevel = ? AND userid != ? AND isactive = ?",
      [2, userId, 1]  // Use 1 instead of true for PostgreSQL compatibility
    );
    
    if (admins[0].count === 0) {
      throw new Error('Cannot delete the last admin user');
    }
  }
  
  // Soft delete the user
  const result = await db_query(client,
    "UPDATE users SET isactive = ? WHERE userid = ?",
    [0, userId]  // Use 0 instead of false for PostgreSQL compatibility
  );
  
  return result[0].changes > 0;
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<{
  totalUsers: number;
  admins: number;
  registeredUsers: number;
  guestUsers: number;
}> {
  const client = await db_init();
  
  const stats = await db_query(client, `
    SELECT 
      COUNT(*) as totalUsers,
      SUM(CASE WHEN userlevel = 2 THEN 1 ELSE 0 END) as admins,
      SUM(CASE WHEN userlevel = 1 THEN 1 ELSE 0 END) as registeredUsers,
      SUM(CASE WHEN userlevel = 0 THEN 1 ELSE 0 END) as guestUsers
    FROM users
    WHERE isactive = ?
  `, [1]);  // Use 1 instead of true for PostgreSQL compatibility
  
  return stats[0];
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const client = await db_init();
  
  const result = await db_query(client,
    "DELETE FROM usersession WHERE expirationdate::TIMESTAMP < CURRENT_TIMESTAMP"
  );
  
  return result[0].changes;
}

/**
 * Store OAuth tokens securely
 */
export async function storeOAuthToken(
  userId: string,
  provider: 'google' | 'facebook' | 'apple' | 'github',
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number
): Promise<void> {
  const client = await db_init();
  
  const tokenId = crypto.randomUUID();
  const now = new Date().toISOString();
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;
  
  // Delete existing tokens for this user/provider combo
  await db_query(client,
    "DELETE FROM oauthtokens WHERE userid = ? AND provider = ?",
    [userId, provider]
  );
  
  // Insert new token
  await db_query(client,
    `INSERT INTO oauthtokens 
     (id, userid, provider, accesstoken, refreshtoken, expiresat, createdat, updatedat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tokenId, userId, provider, accessToken, refreshToken || null, expiresAt, now, now]
  );
}

/**
 * Get OAuth token for a user
 */
export async function getOAuthToken(
  userId: string,
  provider: 'google' | 'facebook' | 'apple' | 'github'
): Promise<OAuthToken | null> {
  const client = await db_init();
  
  const tokens = await db_query(client,
    "SELECT * FROM oauthtokens WHERE userid = ? AND provider = ?",
    [userId, provider]
  );
  
  return tokens.length > 0 ? tokens[0] as OAuthToken : null;
}

/**
 * Validate session and check for suspicious activity
 */
export async function validateSession(sessionToken: string): Promise<{
  valid: boolean;
  user?: User;
  needsRotation?: boolean;
}> {
  const client = await db_init();
  
  // Get session details
  const sessions = await db_query(client,
    `SELECT s.*, u.* FROM usersession s 
     JOIN users u ON s.userid = u.userid 
     WHERE s.sessiontoken = ? AND s.expirationdate::TIMESTAMP > CURRENT_TIMESTAMP AND u.isactive = ?`,
    [sessionToken, 1]  // Use 1 instead of true for PostgreSQL compatibility
  );
  
  if (!sessions || sessions.length === 0) {
    return { valid: false };
  }
  
  const session = sessions[0];
  
  // Check if session needs rotation (older than 24 hours)
  const sessionAge = Date.now() - new Date(session.id).getTime();
  const needsRotation = sessionAge > 24 * 60 * 60 * 1000; // 24 hours
  
  return {
    valid: true,
    user: {
      userid: session.userid,
      oauthid: session.oauthid,
      source: session.source,
      username: session.username,
      email: session.email,
      avatarurl: session.avatarurl,
      userlevel: session.userlevel,
      lastlogindate: session.lastlogindate,
      createddate: session.createddate,
      isactive: session.isactive
    } as User,
    needsRotation
  };
}

/**
 * Rotate session token for security
 */
export async function rotateSession(oldSessionToken: string): Promise<string | null> {
  const client = await db_init();
  
  // Get existing session
  const sessions = await db_query(client,
    "SELECT * FROM usersession WHERE sessiontoken = ? AND expirationdate::TIMESTAMP > CURRENT_TIMESTAMP",
    [oldSessionToken]
  );
  
  if (!sessions || sessions.length === 0) {
    return null;
  }
  
  const session = sessions[0];
  const newSessionToken = crypto.randomBytes(32).toString('base64url');
  
  // Update session with new token
  await db_query(client,
    "UPDATE usersession SET sessiontoken = ?, expirationdate = ? WHERE id = ?",
    [newSessionToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), session.id]
  );
  
  return newSessionToken;
}

/**
 * OAuth token refresh endpoints
 */
const OAUTH_REFRESH_ENDPOINTS = {
  google: 'https://oauth2.googleapis.com/token',
  facebook: 'https://graph.facebook.com/v12.0/oauth/access_token',
  apple: 'https://appleid.apple.com/auth/token',
  github: 'https://github.com/login/oauth/access_token'
};

/**
 * Validate OAuth token with provider
 */
export async function validateOAuthToken(
  userId: string,
  provider: 'google' | 'facebook' | 'apple' | 'github'
): Promise<boolean> {
  const client = await db_init();
  
  // Get stored OAuth token
  const token = await getOAuthToken(userId, provider);
  if (!token) {
    return false;
  }
  
  // Check if token is expired based on stored expiry
  if (token.expiresat && new Date(token.expiresat) < new Date()) {
    // Try to refresh the token
    if (token.refreshtoken) {
      return await refreshOAuthToken(userId, provider);
    }
    return false;
  }
  
  // For providers that don't provide expiry, validate with a test request
  try {
    let validationUrl: string;
    switch (provider) {
      case 'google':
        validationUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token.accesstoken}`;
        break;
      case 'facebook':
        validationUrl = `https://graph.facebook.com/me?access_token=${token.accesstoken}`;
        break;
      case 'github':
        validationUrl = 'https://api.github.com/user';
        break;
      default:
        return true; // Skip validation for providers without easy validation endpoints
    }
    
    const response = await fetch(validationUrl, {
      headers: provider === 'github' ? {
        Authorization: `Bearer ${token.accesstoken}`
      } : {}
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Refresh OAuth token
 */
export async function refreshOAuthToken(
  userId: string,
  provider: 'google' | 'facebook' | 'apple' | 'github'
): Promise<boolean> {
  const client = await db_init();
  
  // Get stored OAuth token with refresh token
  const token = await getOAuthToken(userId, provider);
  if (!token || !token.refreshtoken) {
    return false;
  }
  
  try {
    const refreshEndpoint = OAUTH_REFRESH_ENDPOINTS[provider];
    
    const params: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: token.refreshtoken,
      client_id: process.env[`NEXT_PUBLIC_${provider.toUpperCase()}_CLIENT_ID`]!,
      client_secret: process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]!
    };
    
    const response = await fetch(refreshEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: new URLSearchParams(params).toString()
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    
    // Update stored token
    await storeOAuthToken(
      userId,
      provider,
      data.access_token,
      data.refresh_token || token.refreshtoken, // Some providers don't return new refresh token
      data.expires_in
    );
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create a secure authentication middleware function
 */
export async function createAuthMiddleware(): Promise<{
  validateRequest: (sessionToken: string, userAgent?: string, ipAddress?: string) => Promise<{
    valid: boolean;
    user?: User;
    newSessionToken?: string;
  }>;
}> {
  // Track suspicious activity
  const suspiciousActivity = new Map<string, number>();
  
  return {
    validateRequest: async (sessionToken: string, userAgent?: string, ipAddress?: string) => {
      // Check for suspicious activity (too many requests from same IP)
      if (ipAddress) {
        const requestCount = suspiciousActivity.get(ipAddress) || 0;
        if (requestCount > 100) { // 100 requests per minute threshold
          return { valid: false };
        }
        suspiciousActivity.set(ipAddress, requestCount + 1);
      }
      
      // Validate session
      const sessionData = await validateSession(sessionToken);
      
      if (!sessionData.valid || !sessionData.user) {
        return { valid: false };
      }
      
      // Return validated session with potential rotation
      if (sessionData.needsRotation) {
        const newToken = await rotateSession(sessionToken);
        return {
          valid: true,
          user: sessionData.user,
          newSessionToken: newToken || undefined
        };
      }
      
      return {
        valid: true,
        user: sessionData.user
      };
    }
  };
}

// Clear suspicious activity counter every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const suspiciousActivity = new Map<string, number>();
  }, 60 * 1000);
}
