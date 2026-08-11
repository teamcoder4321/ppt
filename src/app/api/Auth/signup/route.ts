/*
 * Signup endpoint for username/password authentication
 * Handles user registration with email verification
 */

import { NextResponse } from 'next/server';
import { createPasswordAuth } from '../../db-password-auth';
import { send_email } from '../../storage/email';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - at least 8 characters, one uppercase, one lowercase, one number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      );
    }

    // Create password auth record
    const { passwordAuth, verificationToken } = await createPasswordAuth(email, password);

    // Get site domain from environment or default
    const siteDomain = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.LOCAL_DOMAIN;
    const verificationUrl = `${siteDomain}/api/Auth/verify-email?token=${verificationToken}`;

    // Send verification email
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background-color: #f0f0f0; 
                color: #000000; 
                text-decoration: none; 
                border: 1px solid #cccccc;
                border-radius: 4px;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Welcome to ${siteDomain}!</h2>
              <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
              <p style="margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <div class="footer">
                <p>If you didn't create an account, you can safely ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailText = `
Welcome to ${siteDomain}!

Thank you for signing up. Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.
      `;

      await send_email({
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@sitepaige.com',
        subject: 'Verify your email address',
        html: emailHtml,
        text: emailText
      });

      return NextResponse.json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.'
      });

    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Still return success but with a warning
      return NextResponse.json({
        success: true,
        message: 'Registration successful! However, we could not send the verification email. Please contact support.',
        warning: 'Email sending failed'
      });
    }

  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle specific errors
    if (error.message === 'Email already registered') {
      return NextResponse.json(
        { error: 'This email is already registered. Please sign in instead.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
