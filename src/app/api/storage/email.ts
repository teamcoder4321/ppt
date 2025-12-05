import { randomBytes } from 'crypto';

// Simple in-memory storage for email tracking (in production, use a database)
const emailHistory: Map<string, any> = new Map();

export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded content
    contentType?: string;
  }>;
  headers?: Record<string, string>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Send email function that sends emails via the Resend API
 * @param options Email options including to, from, subject, message content, etc.
 * @returns Promise that resolves to the email ID from Resend
 */
export async function send_email(options: EmailOptions): Promise<string> {
  console.log(`📧 Sending email to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
  console.log(`📧 Subject: ${options.subject}`);
  
  try {
    // Get API key from environment
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    
    // Prepare request body for Resend API
    const requestBody: any = {
      to: options.to,
      from: options.from,
      subject: options.subject,
    };
    
    // Add optional fields
    if (options.html) requestBody.html = options.html;
    if (options.text) requestBody.text = options.text;
    if (options.cc) requestBody.cc = options.cc;
    if (options.bcc) requestBody.bcc = options.bcc;
    if (options.replyTo) requestBody.reply_to = options.replyTo;
    if (options.headers) requestBody.headers = options.headers;
    if (options.tags) requestBody.tags = options.tags;
    
    // Handle attachments
    if (options.attachments && options.attachments.length > 0) {
      requestBody.attachments = options.attachments.map(att => ({
        filename: att.filename,
        content: att.content,
        content_type: att.contentType,
      }));
    }
    
    // Make API request to Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Resend API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json();
    const emailId = result.id;
    
    // Store email metadata
    const emailKey = `${Date.now()}_${randomBytes(6).toString('hex')}`;
    emailHistory.set(emailKey, {
      id: emailId,
      to: options.to,
      from: options.from,
      subject: options.subject,
      sentAt: new Date().toISOString(),
      status: 'sent',
    });
    
    console.log(`✅ Email sent successfully. ID: ${emailId}`);
    
    return emailId;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Get email status by ID
 * @param emailId The email ID returned from send_email
 * @returns Email metadata or undefined if not found
 */
export async function getEmailStatus(emailId: string): Promise<any> {
  // Find email in history by Resend ID
  for (const [key, data] of emailHistory.entries()) {
    if (data.id === emailId) {
      return data;
    }
  }
  
  // If not found locally, could query Resend API for status
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  
  try {
    const response = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      return undefined;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching email status:', error);
    return undefined;
  }
}

/**
 * List sent emails from local history
 * @returns Array of email metadata
 */
export function listSentEmails(): Array<any> {
  return Array.from(emailHistory.values());
}

/**
 * Initialize global send_email function for generated API code
 * This makes send_email available in the same way as the preview environment
 */
export function initializeGlobalEmailAPI(): void {
  // Make send_email available globally for API code execution
  (global as any).send_email = send_email;
  (global as any).getEmailStatus = getEmailStatus;
  (global as any).listSentEmails = listSentEmails;
  
  console.log('✅ Global email API initialized');
}
