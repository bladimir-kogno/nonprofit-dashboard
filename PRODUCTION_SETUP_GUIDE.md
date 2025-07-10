# Production Setup Guide

## Issues Found and Solutions

### 1. Missing Firebase Service Account Key

**Problem**: The `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is not set, which prevents server-side Firebase operations from working.

**Solution**: 
1. Go to your Firebase Console (https://console.firebase.google.com)
2. Select your project: `nonprofit-dashboard27`
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Add the entire JSON content as a single line to your `.env.local` file:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"nonprofit-dashboard27",...}
```

### 2. Forms Not Saving to Database

**Problem**: Form components were using placeholder comments instead of actual API calls.

**Solution**: ✅ **FIXED** - Updated all form components to make real API calls:
- `components/forms/DonorForm.tsx` - Now calls `/api/donors`
- `components/forms/VolunteerForm.tsx` - Now calls `/api/volunteers` 
- `components/forms/EventForm.tsx` - Now calls `/api/events`

### 3. Dashboard Using Mock Data

**Problem**: The main dashboard page uses hardcoded mock data instead of fetching from the database.

**Solution**: The dashboard needs to be updated to fetch real data from the API endpoints.

### 4. Email Configuration Issues

**Problem**: Email service might not be properly configured for production.

**Current Configuration**:
- Gmail SMTP is configured with app password
- SendGrid API key is set to placeholder value

**Solution**: 
1. For Gmail: The current setup should work with the app password
2. For SendGrid: Replace `your_sendgrid_api_key_here` with your actual SendGrid API key

## Step-by-Step Production Setup

### Step 1: Add Firebase Service Account Key

1. **Get the Service Account Key**:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Add to Environment Variables**:
   ```bash
   # Copy the entire JSON content and add it to .env.local
   echo 'FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}' >> .env.local
   ```

### Step 2: Verify Email Configuration

1. **Test Gmail SMTP**:
   ```bash
   # Start the development server
   npm run dev
   
   # Test email configuration
   curl http://localhost:3000/api/send-email
   ```

2. **If Gmail doesn't work, configure SendGrid**:
   - Sign up for SendGrid
   - Generate an API key
   - Replace `your_sendgrid_api_key_here` in `.env.local`

### Step 3: Test Form Submissions

1. **Test Donor Form**:
   - Navigate to the donors page
   - Try adding a new donor
   - Check the browser console for success/error messages

2. **Test Volunteer Form**:
   - Navigate to the volunteers page
   - Try adding a new volunteer
   - Verify data appears in Firebase Console

3. **Test Event Form**:
   - Navigate to the events page
   - Try adding a new event
   - Check Firebase Console for the new event

### Step 4: Test Email Sending

1. **Test Sample Email**:
   - Go to the emails page
   - Click "Send Sample Email"
   - Enter your email address
   - Check if you receive the test email

2. **Test Newsletter Sending**:
   - Create a newsletter
   - Click "Send Sample"
   - Verify email delivery

### Step 5: Update Dashboard to Use Real Data

The dashboard currently uses mock data. To fix this, update `app/page.tsx` to fetch real data:

```typescript
// Replace mock data with API calls
const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    activeVolunteers: 0,
    upcomingEvents: 0,
    totalVolunteerHours: 0,
    recentDonors: [],
    upcomingEventsData: []
});

useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const [donorsRes, volunteersRes, eventsRes] = await Promise.all([
                fetch('/api/donors'),
                fetch('/api/volunteers'),
                fetch('/api/events')
            ]);
            
            const donors = await donorsRes.json();
            const volunteers = await volunteersRes.json();
            const events = await eventsRes.json();
            
            setDashboardData({
                totalDonors: donors.length,
                activeVolunteers: volunteers.filter(v => v.active).length,
                upcomingEvents: events.filter(e => e.status === 'upcoming').length,
                totalVolunteerHours: volunteers.reduce((sum, v) => sum + (v.hoursLogged || 0), 0),
                recentDonors: donors.slice(-3),
                upcomingEventsData: events.filter(e => e.status === 'upcoming').slice(-3)
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };
    
    fetchDashboardData();
}, []);
```

## Environment Variables Checklist

Make sure your `.env.local` file contains:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cGxhY2Vob2xkZXI=
CLERK_SECRET_KEY=sk_test_cGxhY2Vob2xkZXI=

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDOw-JvmCM_SEoGHy9wISd9bSv2WarUvCM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nonprofit-dashboard27.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nonprofit-dashboard27
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nonprofit-dashboard27.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=11654339090
NEXT_PUBLIC_FIREBASE_APP_ID=1:11654339090:web:4d8052706502b0473cd6cb

# ⚠️ MISSING: Firebase Service Account Key
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"nonprofit-dashboard27",...}

# Email Configuration
EMAIL_FROM=bladimir.garcia@riseforhope.org
EMAIL_USER=bladimir.garcia@riseforhope.org
EMAIL_PASSWORD=ypgh pewo xzfj ucak
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Checklist

- [ ] Firebase Service Account Key added
- [ ] Forms save data to Firebase
- [ ] Emails are sent successfully
- [ ] Templates are saved to database
- [ ] Dashboard shows real data
- [ ] All API endpoints respond correctly

## Troubleshooting

### If forms still don't save:
1. Check browser console for errors
2. Verify Firebase Service Account Key is correct
3. Check Firebase Console for new documents

### If emails don't send:
1. Test email configuration: `curl http://localhost:3000/api/send-email`
2. Check Gmail app password is correct
3. Try SendGrid as alternative

### If templates don't save:
1. Check if template API endpoints exist
2. Verify database schema is correct
3. Check Firebase Console for template documents

## Next Steps

1. Add the Firebase Service Account Key
2. Test all form submissions
3. Test email sending
4. Update dashboard to use real data
5. Deploy to production environment