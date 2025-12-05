/*
 * Admin User Management API
 * Handles all admin operations for user management
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db_init, db_query } from '../../db';
import { 
  getAllUsers, 
  updateUserPermission, 
  deleteUser, 
  getUserStats,
  getUserByID
} from '../../db-users';
import { validateCsrfToken } from '../../csrf';

// Helper function to check if the current user is an admin
async function checkAdminAuth(): Promise<{ isAdmin: boolean; userId?: string }> {
  const sessionCookie = await cookies();
  const sessionId = sessionCookie.get('session_id')?.value;
  
  if (!sessionId) {
    return { isAdmin: false };
  }
  
  const db = await db_init();
  
  // Get session
  const sessions = await db_query(db,
    "SELECT userid FROM usersession WHERE sessiontoken = ?",
    [sessionId]
  );

  console.log(sessions);
  
  if (sessions.length === 0) {
    return { isAdmin: false };
  }
  
  // Check if user is admin
  const user = await getUserByID(sessions[0].userid);

  if (!user || user.userlevel !== 2) {
    return { isAdmin: false };
  }
  
  return { isAdmin: true, userId: user.userid };
}

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const { isAdmin } = await checkAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Get all users
    const users = await getAllUsers();
    
    // Get user statistics
    const stats = await getUserStats();
    
    return NextResponse.json({
      users,
      stats
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update user permission
export async function PUT(request: NextRequest) {
  // Validate CSRF token
  const isValidCsrf = await validateCsrfToken(request);
  if (!isValidCsrf) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  try {
    // Check if user is admin
    const { isAdmin, userId: adminUserId } = await checkAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const { userId, permissionLevel } = await request.json();
    
    if (!userId || permissionLevel === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and permissionLevel' },
        { status: 400 }
      );
    }
    
    // Validate permission level
    if (![0, 1, 2].includes(permissionLevel)) {
      return NextResponse.json(
        { error: 'Invalid permission level. Must be 0 (guest), 1 (registered), or 2 (admin)' },
        { status: 400 }
      );
    }
    
    // Prevent admin from demoting themselves
    if (adminUserId === userId && permissionLevel < 2) {
      return NextResponse.json(
        { error: 'You cannot demote your own admin account' },
        { status: 400 }
      );
    }
    
    // Update user permission
    const success = await updateUserPermission(userId, permissionLevel);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update user permission' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User permission updated successfully'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user permission' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: NextRequest) {
  // Validate CSRF token
  const isValidCsrf = await validateCsrfToken(request);
  if (!isValidCsrf) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  try {
    // Check if user is admin
    const { isAdmin, userId: adminUserId } = await checkAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    // Prevent admin from deleting themselves
    if (adminUserId === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own admin account' },
        { status: 400 }
      );
    }
    
    // Delete user (soft delete)
    const success = await deleteUser(userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete user' },
      { status: 500 }
    );
  }
} 