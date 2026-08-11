import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '../db-users';
import { updatePassword } from '../db-password-auth';
import { deleteUser } from '../db-users';

// Handle password change
export async function PUT(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionCookie = await cookies();
    const sessionToken = sessionCookie.get('session_id')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validate session and get user details
    const sessionData = await validateSession(sessionToken);

    if (!sessionData.valid || !sessionData.user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Check if user is using password authentication
    if (sessionData.user.source !== 'userpass') {
      return NextResponse.json(
        { error: 'Password changes are only available for email/password accounts' },
        { status: 400 }
      );
    }

    // Validate password requirements
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user has an email (required for password auth)
    if (!sessionData.user.email) {
      return NextResponse.json(
        { error: 'No email associated with this account' },
        { status: 400 }
      );
    }

    // Update the password
    const success = await updatePassword(
      sessionData.user.email,
      currentPassword,
      newPassword
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update password' },
      { status: 500 }
    );
  }
}

// Handle account deletion
export async function DELETE(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionCookie = await cookies();
    const sessionToken = sessionCookie.get('session_id')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validate session and get user details
    const sessionData = await validateSession(sessionToken);

    if (!sessionData.valid || !sessionData.user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { confirmDelete } = await request.json();

    if (confirmDelete !== true) {
      return NextResponse.json(
        { error: 'Please confirm account deletion' },
        { status: 400 }
      );
    }

    // Delete the user account
    try {
      await deleteUser(sessionData.user.userid);
    } catch (error: any) {
      if (error.message && error.message.includes('last admin')) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin account' },
          { status: 400 }
        );
      }
      throw error;
    }

    // Clear the session cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully'
    });
    
    response.cookies.delete('session_id');
    return response;

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete account' },
      { status: 500 }
    );
  }
}
