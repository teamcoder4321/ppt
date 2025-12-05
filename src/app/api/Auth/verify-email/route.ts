/*
 * Email verification endpoint
 * Handles email verification tokens from signup emails
 */

import { NextResponse } from 'next/server';
import { verifyEmailWithToken } from '../../db-password-auth';
import { upsertUser } from '../../db-users';
import { db_init, db_query } from '../../db';
import { cookies } from 'next/headers';
import * as crypto from 'node:crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the email with token
    const authRecord = await verifyEmailWithToken(token);

    if (!authRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Create or update user in the main Users table
    const user = await upsertUser(
      `password_${authRecord.id}`, // Unique OAuth ID for password users
      'userpass' as any, // Source type
      authRecord.email.split('@')[0], // Username from email
      authRecord.email,
      undefined // No avatar for password auth
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Auto-login the user after verification
    const db = await db_init();
    
    // Delete existing sessions for this user
    const existingSessions = await db_query(db, 
      "SELECT id FROM usersession WHERE userid = ?", 
      [user.userid]
    );
    
    if (existingSessions && existingSessions.length > 0) {
      const sessionIds = existingSessions.map(session => session.id);
      const placeholders = sessionIds.map(() => '?').join(',');
      await db_query(db, `DELETE FROM usersession WHERE id IN (${placeholders})`, sessionIds);
    }

    // Generate secure session token and ID
    const sessionId = crypto.randomUUID();
    const sessionToken = crypto.randomBytes(32).toString('base64url');

    // Create new session with secure token
    await db_query(db, 
      "INSERT INTO usersession (id, sessiontoken, userid, expirationdate) VALUES (?, ?, ?, ?)",
      [sessionId, sessionToken, user.userid, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()]
    );

    // Set session cookie with secure token
    const sessionCookie = await cookies();
    sessionCookie.set({
      name: 'session_id', 
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Redirect to home page or dashboard with success message
    const siteDomain = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.LOCAL_DOMAIN;
    const redirectUrl = new URL('/', siteDomain);
    redirectUrl.searchParams.set('verified', 'true');
    
    return NextResponse.redirect(redirectUrl);

  } catch (error: any) {
    console.error('Email verification error:', error);
    
    // Redirect to home with error
    const siteDomain = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.LOCAL_DOMAIN;
    const redirectUrl = new URL('/', siteDomain);
    redirectUrl.searchParams.set('error', 'verification_failed');
    
    return NextResponse.redirect(redirectUrl);
  }
}
