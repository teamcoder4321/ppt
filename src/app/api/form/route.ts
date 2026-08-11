import { NextRequest, NextResponse } from 'next/server';
import { getFormSubmissions, getFormSubmissionById } from '../db-forms';
import { validateSession } from '../db-users';
import { cookies } from 'next/headers';
import { send_email } from '../storage/email';

/**
 * POST /api/form
 * Submit a form with data
 * 
 * Request body:
 * {
 *   formName: string,    // Required: Name/identifier of the form
 *   data: object        // Required: Form data as key-value pairs
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
export async function POST(request: NextRequest) {
  try {

    
    const body = await request.json();
    const { formName, data } = body;
    
    // Validate required fields
    if (!formName || typeof formName !== 'string') {
      return NextResponse.json(
        { error: 'Form name is required' },
        { status: 400 }
      );
    }
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Form data is required and must be an object' },
        { status: 400 }
      );
    }
    
    // Add metadata to the form data
    const enrichedData = {
      ...data,
      _metadata: {
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'Unknown',
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'Unknown',
        referer: request.headers.get('referer') || 'Direct'
      }
    };
    
    // Check if user is authenticated (optional - forms can work for anonymous users too)
    let userId: string | null = null;
    try {
      const sessionCookie = await cookies();
      const sessionToken = sessionCookie.get('session_id')?.value;
      if (sessionToken) {
        const sessionData = await validateSession(sessionToken);
        if (sessionData.valid && sessionData.user) {
          userId = sessionData.user.userid;
          enrichedData._metadata.userId = userId;
          enrichedData._metadata.userEmail = sessionData.user.email;
        }
      }
    } catch (err) {
      // Authentication is optional, continue without user data
    }
    
    // Send email using Resend
    const siteDomain = process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.LOCAL_DOMAIN;
    
    // Determine hostname for email addresses
    let hostname = 'sitepaige.com'; // Fallback
    try {
      if (siteDomain) {
        // Handle potential missing protocol
        const urlStr = siteDomain.startsWith('http') ? siteDomain : `https://${siteDomain}`;
        hostname = new URL(urlStr).hostname;
      }
    } catch (e) {
      console.warn('Could not parse siteDomain for hostname', siteDomain);
    }

    const toAddress = `admin@${hostname}`;
    const fromAddress = process.env.EMAIL_FROM || `noreply@sitepaige.com`;
    
    // Construct email content
    const dataRows = Object.entries(enrichedData)
      .filter(([key]) => key !== '_metadata')
      .map(([key, value]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${key}</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
        </tr>
      `).join('');

    const emailHtml = `
      <h2>New Form Submission: ${formName}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${dataRows}
        </tbody>
      </table>
      <br>
      <h3>Metadata</h3>
      <pre>${JSON.stringify(enrichedData._metadata, null, 2)}</pre>
    `;
    
    const emailText = `
New Form Submission: ${formName}
--------------------------------
${Object.entries(enrichedData)
    .filter(([key]) => key !== '_metadata')
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
    .join('\n')}

Metadata:
${JSON.stringify(enrichedData._metadata, null, 2)}
    `;

    await send_email({
      to: toAddress,
      from: fromAddress,
      subject: `New Form Submission: ${formName}`,
      html: emailHtml,
      text: emailText
    });
    
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit form' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/form
 * Retrieve form submissions (requires admin authentication)
 * 
 * Query parameters:
 * - formName: string (optional) - Filter by form name
 * - limit: number (optional, default 50) - Number of records to return
 * - offset: number (optional, default 0) - Number of records to skip
 * - id: number (optional) - Get a specific submission by ID
 * 
 * Response:
 * {
 *   submissions: Array<{
 *     id: number,
 *     timestamp: string,
 *     form_name: string,
 *     form_data: object
 *   }>,
 *   total: number
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication - only admins can view form submissions
    const sessionCookie = await cookies();
    const sessionToken = sessionCookie.get('session_id')?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const sessionData = await validateSession(sessionToken);
    if (!sessionData.valid || !sessionData.user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    // Check if user is admin (userlevel 2)
    if (sessionData.user.userlevel !== 2) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const formName = searchParams.get('formName') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const id = searchParams.get('id');
    
    // If ID is provided, get a specific submission
    if (id) {
      const submission = await getFormSubmissionById(parseInt(id, 10));
      if (!submission) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ submission });
    }
    
    // Get form submissions with pagination
    const [submissions, total] = await Promise.all([
      getFormSubmissions(formName, limit, offset),
      getFormSubmissionCount(formName)
    ]);
    
    return NextResponse.json({
      submissions,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + submissions.length < total
      }
    });
    
  } catch (error) {
    console.error('Form retrieval error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve forms' },
      { status: 500 }
    );
  }
}

// Import the missing function
import { getFormSubmissionCount } from '../db-forms';
