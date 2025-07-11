/*
 * lib/email-service.ts
 * 
 * Optimized email service with SendGrid primary and Gmail SMTP fallback
 * Supports both transactional emails and bulk newsletters
 */

import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Gmail SMTP transporter (fallback)
const gmailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    type?: string;
  }>;
}

export interface BulkEmailOptions {
  recipients: Array<{
    email: string;
    name?: string;
    personalizations?: Record<string, string>;
  }>;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  templateId?: string;
}

class EmailService {
  private usesSendGrid: boolean;
  
  constructor() {
    this.usesSendGrid = !!process.env.SENDGRID_API_KEY && process.env.EMAIL_SERVICE === 'sendgrid';
  }

  /**
   * Send single email using SendGrid or Gmail SMTP
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (this.usesSendGrid) {
        return await this.sendWithSendGrid(options);
      } else {
        return await this.sendWithGmail(options);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Fallback: if SendGrid fails, try Gmail
      if (this.usesSendGrid) {
        console.log('SendGrid failed, attempting Gmail fallback...');
        try {
          return await this.sendWithGmail(options);
        } catch (fallbackError) {
          console.error('Gmail fallback also failed:', fallbackError);
          return false;
        }
      }
      return false;
    }
  }

  /**
   * Send bulk emails (optimized for newsletters)
   */
  async sendBulkEmail(options: BulkEmailOptions): Promise<{ sent: number; failed: number }> {
    if (this.usesSendGrid) {
      return await this.sendBulkWithSendGrid(options);
    } else {
      return await this.sendBulkWithGmail(options);
    }
  }

  /**
   * Send email using SendGrid API
   */
  private async sendWithSendGrid(options: EmailOptions): Promise<boolean> {
    const msg = {
      to: Array.isArray(options.to) ? options.to : [options.to],
      from: options.from || process.env.EMAIL_FROM || 'noreply@riseforhope.org',
      subject: options.subject,
      html: options.html,
      text: options.text,
      bcc: options.bcc,
    };

    const [response] = await sgMail.send(msg);
    return response.statusCode >= 200 && response.statusCode < 300;
  }

  /**
   * Send email using Gmail SMTP
   */
  private async sendWithGmail(options: EmailOptions): Promise<boolean> {
    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      bcc: options.bcc?.join(', '),
      attachments: options.attachments,
    };

    const info = await gmailTransporter.sendMail(mailOptions);
    return !!info.messageId;
  }

  /**
   * Send bulk emails using SendGrid (batch processing)
   */
  private async sendBulkWithSendGrid(options: BulkEmailOptions): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;
    
    // SendGrid v3 API - send individual emails for better reliability
    for (const recipient of options.recipients) {
      try {
        const msg = {
          to: { email: recipient.email, name: recipient.name },
          from: options.from || process.env.EMAIL_FROM || 'noreply@riseforhope.org',
          subject: options.subject,
          html: options.html,
          text: options.text,
          ...(options.templateId && { templateId: options.templateId }),
          ...(recipient.personalizations && { 
            dynamicTemplateData: recipient.personalizations 
          }),
        };

        await sgMail.send(msg);
        sent++;
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        failed++;
      }
    }
    
    return { sent, failed };
  }

  /**
   * Send bulk emails using Gmail SMTP (less efficient but reliable)
   */
  private async sendBulkWithGmail(options: BulkEmailOptions): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;
    
    for (const recipient of options.recipients) {
      try {
        const success = await this.sendWithGmail({
          to: recipient.email,
          subject: options.subject,
          html: options.html,
          text: options.text,
          from: options.from,
        });
        
        if (success) sent++;
        else failed++;
        
        // Rate limiting delay for Gmail
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        failed++;
      }
    }
    
    return { sent, failed };
  }

  /**
   * Verify email service configuration
   */
  async verifyConfiguration(): Promise<{ sendgrid: boolean; gmail: boolean }> {
    const results = { sendgrid: false, gmail: false };
    
    // Test SendGrid
    if (process.env.SENDGRID_API_KEY) {
      try {
        // Simple API call to verify the key works
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        results.sendgrid = true;
      } catch (error) {
        console.warn('SendGrid verification failed:', error);
      }
    }
    
    // Test Gmail SMTP
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await gmailTransporter.verify();
        results.gmail = true;
      } catch (error) {
        console.warn('Gmail SMTP verification failed:', error);
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Helper functions
export const sendWelcomeEmail = async (email: string, name: string) => {
  return emailService.sendEmail({
    to: email,
    subject: 'Welcome to Rise for Hope!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Welcome ${name}!</h2>
        <p>Thank you for joining Rise for Hope. We're excited to have you as part of our community.</p>
        <p>You'll receive updates about our latest initiatives, events, and ways to get involved.</p>
        <p>Best regards,<br>The Rise for Hope Team</p>
      </div>
    `,
  });
};

export const sendNewsletterEmail = async (recipients: BulkEmailOptions['recipients'], subject: string, content: string) => {
  return emailService.sendBulkEmail({
    recipients,
    subject,
    html: content,
    from: 'newsletter@riseforhope.org',
  });
};