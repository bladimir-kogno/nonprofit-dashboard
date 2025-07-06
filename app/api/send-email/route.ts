import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email service configuration
const createTransporter = () => {
    // For development, you can use a service like Gmail, SendGrid, or Mailtrap
    // For production, use SendGrid, AWS SES, or similar
    
    // Example for Gmail (requires app password)
    // return nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // });

    // Example for SendGrid
    // return nodemailer.createTransport({
    //     host: 'smtp.sendgrid.net',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: 'apikey',
    //         pass: process.env.SENDGRID_API_KEY
    //     }
    // });

    // For development/testing - using Ethereal Email (fake SMTP)
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'ethereal.user@ethereal.email',
            pass: 'ethereal.pass'
        }
    });
};

// Replace template variables with actual values
const replaceVariables = (html: string, variables: Record<string, string>) => {
    let result = html;
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        result = result.replace(regex, value);
    });
    return result;
};

export async function POST(request: Request) {
    try {
        const { to, subject, htmlContent, variables = {}, type } = await request.json();

        if (!to || !subject || !htmlContent) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, htmlContent' },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = createTransporter();

        // Replace variables in content
        const processedContent = replaceVariables(htmlContent, variables);

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@yournonprofit.org',
            to: Array.isArray(to) ? to.join(', ') : to,
            subject: replaceVariables(subject, variables),
            html: processedContent,
            // Add plain text version
            text: processedContent.replace(/<[^>]*>/g, ''),
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        // Log email for development
        console.log('Email sent:', {
            type,
            to: mailOptions.to,
            subject: mailOptions.subject,
            messageId: info.messageId,
            preview: nodemailer.getTestMessageUrl(info) || 'N/A'
        });

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            preview: nodemailer.getTestMessageUrl(info),
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// GET endpoint to test email configuration
export async function GET() {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        
        return NextResponse.json({
            success: true,
            message: 'Email service is configured and ready'
        });
    } catch (error) {
        console.error('Email service verification failed:', error);
        return NextResponse.json({
            success: false,
            error: 'Email service configuration error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}