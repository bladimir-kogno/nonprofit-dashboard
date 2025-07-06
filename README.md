# Nonprofit Management Web App

A minimalist, responsive dashboard for managing donors, volunteers, events, and reports.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

## Features

- Donor, volunteer, and event management
- **Contact Management with Excel Upload** - Upload Excel files with contact lists for newsletters and emails
- Basic reporting dashboard
- Mobile-responsive layout
- Reusable components and modular structure
- **Organization Logo Placeholder** - SVG logo placeholder in the header for branding

## Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — start production server

## Contact Management

The application now includes a comprehensive contact management system:

### Excel Upload Feature
- Upload Excel files (.xlsx, .xls) or CSV files with contact information
- Expected format: Name, Company, Email, Phone (in that order)
- Automatic duplicate detection by email address
- Sample file included: `sample-contacts.csv`

### Contact Management Features
- Search across all contact fields (name, company, email, phone)
- Export all contacts to Excel format
- Individual contact deletion
- Bulk delete all contacts
- Persistent storage using localStorage
- Direct email links for quick contact

### Usage
1. Navigate to the "Contacts" section in the sidebar
2. Click "Choose File" to upload your Excel/CSV file
3. The system will process and import contacts automatically
4. Use the search bar to find specific contacts
5. Export your contact list anytime using the "Export Excel" button

## Deployment

Optimized for Vercel. Push to your Git repository and connect it in the Vercel dashboard.

## Directory Overview

- `app/` — pages and API routes
- `components/` — UI components
- `styles/` — global styles and Tailwind config
- `lib/` — utilities and database helpers
- `types/` — TypeScript interfaces
