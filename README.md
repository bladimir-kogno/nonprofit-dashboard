# Nonprofit Email Newsletter Management System

A comprehensive email newsletter management system built with Next.js, Supabase, and Clerk authentication. This system addresses overflow issues and provides a modern, responsive interface for managing email campaigns, templates, and automation.

## 🚀 Features

### Email Newsletter Management
- **Newsletter Creation & Editing**: Rich HTML editor with template variables
- **Template Management**: Reusable email templates for different purposes
- **Email Automation**: Trigger-based email sending for donor acknowledgments, welcome messages, etc.
- **Recipient Management**: Organize contacts by type (donors, volunteers, subscribers, event attendees)
- **Campaign Tracking**: Monitor email opens, clicks, and delivery status
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Key Improvements Made
- ✅ **Fixed Overflow Issues**: Proper responsive design and content truncation
- ✅ **Enhanced Modal System**: Large, scrollable modals for complex forms
- ✅ **Improved HTML Editor**: Better overflow handling and clickable variables
- ✅ **Mobile-First Design**: Fully responsive layout for all screen sizes
- ✅ **Better UX**: Expandable content, loading states, and visual feedback
- ✅ **Consolidated Codebase**: Single, clean repository with all latest features

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Authentication**: Clerk (user management and authentication)
- **Email**: Nodemailer with multiple provider support
- **Rich Text Editor**: TipTap for HTML email content
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Clerk account and application
- Email service provider (Gmail, SendGrid, etc.)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd nonprofit-email-management
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email Configuration
EMAIL_FROM=noreply@yournonprofit.org
EMAIL_USER=your_email_user_here
EMAIL_PASSWORD=your_email_password_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the script to create all necessary tables, indexes, and functions

### 4. Clerk Authentication Setup

1. Create a new Clerk application
2. Configure your authentication providers
3. Set up your redirect URLs in Clerk dashboard
4. Add your Clerk keys to the environment variables

### 5. Email Service Configuration

#### Option A: Gmail (Development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use your Gmail address as `EMAIL_USER` and app password as `EMAIL_PASSWORD`

#### Option B: SendGrid (Production)
1. Create a SendGrid account
2. Generate an API key
3. Add the API key to `SENDGRID_API_KEY`

#### Option C: Other Providers
Update the `createTransporter` function in `app/api/send-email/route.ts` with your provider's settings.

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Testing Email Configuration
```bash
# Test if email service is configured correctly
curl http://localhost:3000/api/send-email
```

## 📊 Database Schema

The system uses the following main tables:

- **email_templates**: Reusable email templates
- **newsletters**: Newsletter campaigns
- **email_automations**: Automated email rules
- **email_recipients**: Contact management
- **email_campaigns**: Individual email sends and tracking

## 🎨 Key Components

### Fixed Components
- **Modal Component**: Now supports multiple sizes and proper scrolling
- **HTML Editor**: Enhanced with better overflow handling and clickable variables
- **Email Management Page**: Responsive design with expandable content
- **Layout**: Improved header and navigation

### New Features
- **Content Truncation**: Long content is properly truncated with expand/collapse
- **Loading States**: Visual feedback during operations
- **Error Handling**: Better error messages and user feedback
- **Mobile Optimization**: Fully responsive design

## 📱 Responsive Design

The system is fully responsive and works on:
- **Desktop**: Full-featured interface
- **Tablet**: Adapted layout with collapsible sidebars
- **Mobile**: Touch-friendly interface with stacked layouts

## 🔐 Security Features

- **Row Level Security**: Implemented in Supabase
- **Authentication**: Clerk handles secure authentication
- **Input Validation**: Zod schemas for form validation
- **XSS Protection**: HTML sanitization in email content

## 🎯 Usage Guide

### Creating a Newsletter
1. Navigate to the Newsletters tab
2. Click "Create Newsletter"
3. Fill in the title and subject
4. Use the HTML editor to create your content
5. Click variables to insert them automatically
6. Save as draft or send immediately

### Managing Templates
1. Go to the Templates tab
2. Create reusable templates for different purposes
3. Use template variables like `[DONOR_NAME]`, `[AMOUNT]`, etc.
4. Templates can be used in newsletters and automations

### Setting Up Automation
1. Navigate to the Automation tab
2. Create rules based on triggers (new donor, donation received, etc.)
3. Select the appropriate email template
4. Toggle automation on/off as needed

### Managing Recipients
Recipients are automatically managed through the database, but you can:
- Import contacts via CSV
- Organize by type (donor, volunteer, subscriber, etc.)
- Track subscription status
- View engagement metrics

## 🔍 Analytics & Tracking

The system provides:
- **Email Open Tracking**: Pixel-based tracking
- **Click Tracking**: Link tracking with analytics
- **Delivery Statistics**: Success/failure rates
- **Engagement Metrics**: Open rates, click rates
- **Campaign Performance**: Detailed campaign analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure no linting errors
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the GitHub issues page
2. Review the documentation
3. Contact the development team

## 🎉 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed on any platform that supports Next.js applications.

## 🔄 Recent Updates

- ✅ Fixed all overflow issues in email management
- ✅ Improved responsive design for mobile devices
- ✅ Enhanced HTML editor with better UX
- ✅ Added Clerk authentication integration
- ✅ Consolidated all features into single repository
- ✅ Improved database schema with proper relationships
- ✅ Added comprehensive tracking and analytics
- ✅ Better error handling and user feedback

This system is now ready for production use with proper scaling considerations and security measures in place.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
