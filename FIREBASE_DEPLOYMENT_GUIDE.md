# 🚀 Firebase Deployment Guide - Step by Step

## Prerequisites ✅
- [x] Firebase project: `nonprofit-dashboard27` 
- [x] Build working: Static files in `out/` directory
- [x] Firebase configuration: Already set up
- [x] SendGrid integration: Complete

## Step 1: Install Firebase CLI

### Option A: Install via npm (Recommended)
```bash
npm install -g firebase-tools
```

### Option B: Alternative installation methods
```bash
# Via curl (Linux/Mac)
curl -sL https://firebase.tools | bash

# Via standalone binary (check Firebase docs for latest)
```

### Verify installation:
```bash
firebase --version
```
*Expected: Should show version number (e.g., 13.x.x)*

## Step 2: Authenticate with Firebase

```bash
firebase login
```

**What happens:**
1. Opens browser for Google authentication
2. Select the Google account associated with your Firebase project
3. Grant permissions to Firebase CLI
4. You'll see "Firebase CLI Login Successful" message

**Troubleshooting:**
- If browser doesn't open: `firebase login --no-localhost`
- If already logged in: `firebase logout` then `firebase login` again

## Step 3: Verify Firebase Project Connection

```bash
# Check current project
firebase projects:list

# Make sure you're using the correct project
firebase use nonprofit-dashboard27
```

**Expected output:**
```
Now using project nonprofit-dashboard27
```

## Step 4: Test Your Build Locally

```bash
# Build the project (should already be done)
npm run build

# Verify out/ directory exists and has files
ls -la out/

# Test with Firebase hosting emulator
firebase serve
```

**What to expect:**
- Firebase serves your app locally (usually http://localhost:5000)
- Open the URL in your browser
- Test login, navigation, and basic functionality
- Press `Ctrl+C` to stop the local server

## Step 5: Deploy to Firebase Hosting

### Initial deployment:
```bash
npm run firebase-deploy
```

**This command does:**
1. `next build` - Builds your app
2. `firebase deploy` - Uploads to Firebase hosting

### Alternative (if above fails):
```bash
# Manual step-by-step
npm run build
firebase deploy --only hosting
```

**During deployment you'll see:**
```
=== Deploying to 'nonprofit-dashboard27'...

i  deploying hosting
i  hosting[nonprofit-dashboard27]: beginning deploy...
i  hosting[nonprofit-dashboard27]: found 20 files in out
✔  hosting[nonprofit-dashboard27]: file upload complete
i  hosting[nonprofit-dashboard27]: finalizing version...
✔  hosting[nonprofit-dashboard27]: version finalized
i  hosting[nonprofit-dashboard27]: releasing new version...
✔  hosting[nonprofit-dashboard27]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/nonprofit-dashboard27/overview
Hosting URL: https://nonprofit-dashboard27.web.app
```

## Step 6: Verify Deployment

### 1. Check Firebase Console
Visit: https://console.firebase.google.com/project/nonprofit-dashboard27/hosting

**You should see:**
- ✅ Active deployment
- ✅ Deployment timestamp
- ✅ File count and size

### 2. Test Your Live Website
Visit: **https://nonprofit-dashboard27.web.app**

**Test checklist:**
- [ ] Website loads correctly
- [ ] Authentication works (login with: `riseforhope@admin` / `RiseForHope2024!`)
- [ ] Navigation between pages works
- [ ] Firebase database connectivity (try adding a contact)
- [ ] Email functionality (if applicable)

### 3. Check Firebase Hosting Status
```bash
firebase hosting:sites:list
```

## Step 7: Set Up Custom Domain (Optional)

### If you have a custom domain:
```bash
firebase hosting:sites:create your-domain-name
firebase target:apply hosting your-site your-domain-name
firebase deploy --only hosting:your-site
```

### In Firebase Console:
1. Go to Hosting section
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Step 8: Set Up Firestore Database (If needed)

### Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### Deploy Firestore indexes (if you have any):
```bash
firebase deploy --only firestore:indexes
```

## Common Issues & Solutions

### Issue 1: "Firebase CLI not found"
**Solution:**
```bash
# Reinstall Firebase CLI
npm uninstall -g firebase-tools
npm install -g firebase-tools
```

### Issue 2: "Permission denied" during deployment
**Solution:**
```bash
# Re-authenticate
firebase logout
firebase login
```

### Issue 3: "Build failed" during deployment
**Solution:**
```bash
# Test build locally first
npm run build
# If successful, then deploy
firebase deploy --only hosting
```

### Issue 4: "404 Not Found" on deployed site
**Solution:**
- Check that `out/` directory has `index.html`
- Verify `firebase.json` has correct rewrite rules
- Check Firebase Console for deployment errors

### Issue 5: Database connection issues
**Solution:**
1. Check Firestore rules are deployed
2. Verify environment variables
3. Check browser console for errors

## Post-Deployment Checklist

### ✅ Essential Checks
- [ ] Website loads at: https://nonprofit-dashboard27.web.app
- [ ] Login functionality works
- [ ] All pages accessible
- [ ] Firebase database operations work
- [ ] Email sending functionality (test carefully)

### ⚡ Performance Checks
- [ ] Page load speed (should be fast due to CDN)
- [ ] Mobile responsiveness
- [ ] Console errors (should be minimal)

### 🔒 Security Checks
- [ ] Firestore rules preventing unauthorized access
- [ ] Authentication working properly
- [ ] No sensitive data exposed in browser

## Continuous Deployment

### For future updates:
```bash
# Make your changes, then:
npm run firebase-deploy
```

### Set up automatic deployment (GitHub Actions example):
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: nonprofit-dashboard27
```

## Emergency Rollback

### If something goes wrong:
```bash
# View deployment history
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:releases:rollback
```

## Monitoring & Analytics

### Enable Firebase Analytics:
1. Go to Firebase Console > Analytics
2. Enable Google Analytics
3. Add tracking code if needed

### Monitor performance:
1. Firebase Console > Performance
2. Check page load times
3. Monitor API response times

---

## 🎉 Congratulations!

Your nonprofit management system is now live at:
**https://nonprofit-dashboard27.web.app**

**Key URLs:**
- 🌐 **Live Website**: https://nonprofit-dashboard27.web.app
- 🔧 **Firebase Console**: https://console.firebase.google.com/project/nonprofit-dashboard27
- 📊 **Hosting Dashboard**: https://console.firebase.google.com/project/nonprofit-dashboard27/hosting

**Support:**
- Firebase Documentation: https://firebase.google.com/docs/hosting
- Firebase Status: https://status.firebase.google.com/

Your app is now globally distributed via Firebase's CDN for maximum performance! 🚀