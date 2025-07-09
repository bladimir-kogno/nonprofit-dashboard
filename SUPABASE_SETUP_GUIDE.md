# 🚀 Supabase Setup Guide for Nonprofit Dashboard

## Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login (GitHub login is fastest)
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: `nonprofit-dashboard`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to you
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

### Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:

```bash
# You'll need these 3 values:
Project URL: https://[your-project-id].supabase.co
anon public key: eyJ... (long string starting with eyJ)
service_role key: eyJ... (different long string starting with eyJ)
```

### Step 3: Update Your .env.local File
Replace the placeholder values in your `.env.local` file:

```env
# Replace these lines in your .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `database-schema.sql` (from your project)
4. Click "Run" 
5. You should see "Success. No rows returned" - this is correct!

### Step 5: Test the Connection
1. Save your `.env.local` file
2. Restart your development server: `npm run dev`
3. Go to http://localhost:3000
4. You should see green "● Connected to database" indicators instead of amber warnings
5. Try adding a contact or donor - it should persist when you refresh the page

## 🎉 You're Done!

Your app should now be fully functional with:
- ✅ Real database storage in Supabase
- ✅ Data persistence across sessions  
- ✅ Multi-user data sharing
- ✅ Email functionality with Gmail
- ✅ Contact and donor management
- ✅ Dashboard with real statistics

## 🔧 Troubleshooting

### If you see "Unable to connect to database" warnings:
1. Double-check your Supabase credentials in `.env.local`
2. Make sure there are no extra spaces or quotes
3. Restart the development server
4. Check Supabase dashboard is accessible

### If tables don't exist errors:
1. Go back to Supabase SQL Editor
2. Re-run the `database-schema.sql` script
3. Verify tables were created in **Table Editor**

### If email features don't work:
- Email is already configured with Gmail SMTP
- The send-email API should work for testing
- For production, consider setting up SendGrid

## 📊 What You'll Have

### Working Features:
- **Dashboard**: Real-time donor and volunteer counts
- **Contacts**: Full database storage with Excel import/export
- **Donors**: Database storage with donation tracking and email automation
- **Emails**: Newsletter system with templates (uses sample data for now)
- **Events & Volunteers**: Enhanced interfaces (some still using sample data)

### Database Tables Created:
- `email_recipients` - Stores all contacts, donors, volunteers
- `email_templates` - Reusable email templates
- `newsletters` - Email campaigns and tracking
- `email_automations` - Automated email rules
- `email_campaigns` - Individual email tracking

## 🔐 Security Notes

- Your `anon` key is safe to use in frontend code
- Never expose your `service_role` key in frontend code
- The app uses Row Level Security (RLS) for data protection
- All API calls are authenticated through your environment variables

## 💡 Pro Tips

1. **Backup**: Supabase automatically backs up your data
2. **Monitoring**: Use Supabase dashboard to monitor usage
3. **Scaling**: Free tier includes 500MB database + 2GB bandwidth
4. **Production**: Consider upgrading to Pro tier for production use

Need help? The app has been designed with graceful fallbacks, so it will work even if Supabase isn't configured yet, but you'll get much better functionality with the database connected!