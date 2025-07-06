#!/bin/bash

# Email Newsletter Management System Setup Script
echo "🚀 Setting up Email Newsletter Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cp .env.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
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
EOF
    echo "📝 .env.local created. Please update it with your actual values."
else
    echo "✅ .env.local exists"
fi

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env.local with your Clerk and Supabase credentials"
    echo "2. Run the database schema in your Supabase SQL editor (see database-schema.sql)"
    echo "3. Configure your email service provider"
    echo "4. Start the development server: npm run dev"
    echo ""
    echo "📚 For detailed instructions, see README.md"
    echo ""
    echo "🚀 Ready to start? Run: npm run dev"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi