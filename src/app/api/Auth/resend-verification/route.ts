/*
 * Resend verification email endpoint
 * Allows users to request a new verification email
 */

import { NextResponse } from 'next/server';
import { regenerateVerificationToken } from '../../db-password-auth';
import { send_email } from '../../storage/email';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Regenerate verification token
    const result = await regenerateVerificationToken(email);

    if (!result) {
      // Don't reveal whether the email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an unverified account exists with this email, a verification email has been sent.'
      });
    }

    const { verificationToken } = result;

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
              <h2>Verify Your Email Address</h2>
              <p>You requested a new verification email for your account at ${siteDomain}. Please verify your email address by clicking the button below:</p>
              <p style="margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #0066cc;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <div class="footer">
                <p>If you didn't request this email, you can safely ignore it.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailText = `
Verify Your Email Address

You requested a new verification email for your account at ${siteDomain}. Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't request this email, you can safely ignore it.
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
        message: 'Verification email sent successfully! Please check your email.'
      });

    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send verification email. Please try again later.'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Resend verification error:', error);

    if (error.message === 'Email is already verified') {
      return NextResponse.json(
        { error: 'This email is already verified. Please sign in.' },
        { status: 400 }
      );
    }

    // Generic response to avoid revealing whether email exists
    return NextResponse.json({
      success: true,
      message: 'If an unverified account exists with this email, a verification email has been sent.'
    });
  }
}
