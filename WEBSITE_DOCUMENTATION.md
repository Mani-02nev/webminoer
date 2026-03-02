# React Webinar Platform - Complete Website Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Pages & Routes](#pages--routes)
6. [Components](#components)
7. [Utilities & Services](#utilities--services)
8. [Features](#features)
9. [Environment Configuration](#environment-configuration)
10. [Deployment](#deployment)
11. [User Workflows](#user-workflows)
12. [Admin Workflows](#admin-workflows)

---

## 📖 Project Overview

**Project Name:** React Webinar Platform  
**Purpose:** A complete webinar management system for hosting educational webinars with registration, attendance tracking, and automated certificate generation.

**Key Capabilities:**
- User registration for webinars
- Automated email confirmations
- Attendance marking system
- Certificate generation and distribution
- Certificate verification system
- Admin dashboard for managing participants and certificates

---

## 🛠 Technology Stack

### Frontend Framework
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.13.0** - Client-side routing

### Styling & UI
- **Tailwind CSS 3.4.19** - Utility-first CSS framework
- **Framer Motion 12.31.0** - Animation library
- **Lucide React 0.563.0** - Icon library
- **Three.js 0.182.0** - 3D graphics (with React Three Fiber)

### Backend & Services
- **Supabase 2.39.7** - Backend-as-a-Service (Database, Authentication)
- **EmailJS 4.4.1** - Email service for automated emails

### Document Generation
- **jsPDF 4.1.0** - PDF generation for certificates
- **html2canvas 1.4.1** - HTML to canvas conversion

### Utilities
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.4.0** - Merge Tailwind classes

---

## 📁 Project Structure

```
webinar-react/
├── public/
│   ├── react-logo.png          # React logo for certificates
│   └── vite.svg                # Vite favicon
│
├── src/
│   ├── assets/
│   │   ├── logo.png            # Tech Stack logo
│   │   ├── logoBase64.js       # Base64 encoded logo
│   │   └── react.jpg           # React image asset
│   │
│   ├── components/
│   │   ├── AmbientBackground.jsx    # Animated background component
│   │   ├── CountdownTimer.jsx       # Countdown timer for webinar
│   │   ├── ErrorBoundary.jsx        # Error handling wrapper
│   │   ├── Footer.jsx               # Site footer
│   │   └── Navbar.jsx               # Navigation bar
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx          # Home page
│   │   ├── RegistrationPage.jsx     # User registration form
│   │   ├── ConfirmationPage.jsx     # Registration confirmation
│   │   ├── AttendancePage.jsx       # Attendance marking form
│   │   ├── CertificatePreviewPage.jsx  # Certificate display & download
│   │   ├── VerifyCertificatePage.jsx   # Certificate verification
│   │   ├── AdminGeneratorPage.jsx      # Admin dashboard
│   │   ├── ProgramsPage.jsx         # Programs/courses listing
│   │   └── AboutPage.jsx            # About page
│   │
│   ├── lib/
│   │   └── supabase.js          # Supabase client configuration
│   │
│   ├── utils/
│   │   ├── emailTrigger.js      # Email sending functions
│   │   └── generateCertificate.js  # Certificate PDF generation
│   │
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Global styles
│   └── App.css                  # App-specific styles
│
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
├── vercel.json                  # Vercel deployment config
│
└── Documentation/
    ├── WEBSITE_DOCUMENTATION.md      # This file
    ├── CERTIFICATE_SENDING_GUIDE.md  # Certificate sending guide
    ├── DEPLOYMENT.md                 # Deployment instructions
    ├── EMAILJS_TROUBLESHOOTING.md    # Email troubleshooting
    └── README.md                     # Project readme
```

---

## 🗄 Database Schema

### Supabase Tables

#### 1. **participants** Table
Stores user registration data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Participant's full name |
| `email` | TEXT | Email address (unique) |
| `college` | TEXT | College/institution name |
| `whatsapp` | TEXT | WhatsApp number |
| `current_year` | TEXT | Current academic year |
| `created_at` | TIMESTAMP | Registration timestamp |

**Indexes:**
- Unique index on `email`

---

#### 2. **attendance** Table
Tracks webinar attendance and feedback.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Attendee's name |
| `email` | TEXT | Email address (unique) |
| `whatsapp` | TEXT | WhatsApp number |
| `rating` | INTEGER | Session rating (1-5 stars) |
| `feedback` | TEXT | Attendee feedback/comments |
| `created_at` | TIMESTAMP | Attendance marked timestamp |

**Indexes:**
- Unique index on `email`

---

#### 3. **certificates** Table
Stores generated certificates.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `certificate_id` | TEXT | Unique certificate ID (e.g., TT-REACT-2026-1234) |
| `name` | TEXT | Recipient's name |
| `email` | TEXT | Recipient's email |
| `webinar_title` | TEXT | Webinar title |
| `issued_date` | DATE | Certificate issue date |
| `is_completed` | BOOLEAN | Completion status |
| `conducted_by` | TEXT | Instructor/organization info |
| `created_at` | TIMESTAMP | Certificate creation timestamp |

**Indexes:**
- Unique index on `certificate_id`
- Index on `email`

---

## 🗺 Pages & Routes

### Public Routes

#### 1. **Landing Page** (`/`)
- **File:** `src/pages/LandingPage.jsx`
- **Purpose:** Home page showcasing the webinar
- **Features:**
  - Hero section with webinar details
  - Countdown timer to webinar date
  - Key highlights and benefits
  - Call-to-action buttons (Register, Learn More)
  - Animated background effects
  - Responsive design

---

#### 2. **Registration Page** (`/register`)
- **File:** `src/pages/RegistrationPage.jsx`
- **Purpose:** User registration form
- **Form Fields:**
  - Full Name (for certificate)
  - Email Address
  - College/Institution
  - WhatsApp Number
  - Current Academic Year
- **Features:**
  - Form validation
  - Duplicate email check
  - Automatic email confirmation via EmailJS
  - Redirects to confirmation page on success
  - Error handling and user feedback

---

#### 3. **Confirmation Page** (`/confirmation`)
- **File:** `src/pages/ConfirmationPage.jsx`
- **Purpose:** Registration success confirmation
- **Features:**
  - Success message display
  - Webinar details reminder
  - WhatsApp group join link
  - Next steps instructions
  - Email confirmation status

---

#### 4. **Attendance Page** (`/attendance`)
- **File:** `src/pages/AttendancePage.jsx`
- **Purpose:** Mark attendance after attending webinar
- **Form Fields:**
  - Full Name
  - Email Address (must match registration)
  - WhatsApp Number
  - Session Rating (1-5 stars)
  - Feedback/Key Takeaways
- **Features:**
  - Duplicate attendance prevention
  - Star rating system
  - Feedback collection
  - Success confirmation
  - Triggers certificate generation eligibility

---

#### 5. **Certificate Preview Page** (`/certificate/:id`)
- **File:** `src/pages/CertificatePreviewPage.jsx`
- **Purpose:** Display and download certificates
- **Features:**
  - Fetches certificate from database by ID
  - Displays certificate details
  - PDF download functionality
  - Share certificate link
  - Responsive certificate design
  - Verification link
- **URL Parameters:**
  - `:id` - Certificate ID (e.g., TT-REACT-2026-1234)
  - Query param: `?download=true` - Auto-download on load

---

#### 6. **Certificate Verification Page** (`/verify` or `/verify/:id`)
- **File:** `src/pages/VerifyCertificatePage.jsx`
- **Purpose:** Verify certificate authenticity
- **Features:**
  - Certificate ID input field
  - Database lookup for certificate
  - Display certificate details if valid
  - Show error if certificate not found
  - Pre-fill ID from URL parameter
  - Verification status indicator

---

#### 7. **Programs Page** (`/programs`)
- **File:** `src/pages/ProgramsPage.jsx`
- **Purpose:** List available programs/courses
- **Features:**
  - Program cards with details
  - Enrollment information
  - Upcoming sessions
  - Call-to-action buttons

---

### Protected Routes

#### 8. **Admin Dashboard** (`/admin`)
- **File:** `src/pages/AdminGeneratorPage.jsx`
- **Purpose:** Admin panel for managing certificates
- **Authentication:** Password-protected (`mani02112007`)
- **Features:**
  - Three tabs: Registered Users, Attendance, Manual Entry
  - View all registered participants
  - View attendance list with ratings and feedback
  - Generate certificates individually
  - Bulk send certificates to all attendees
  - Resend registration emails
  - Resend certificate emails
  - Manual certificate generation
  - Download generated PDFs
  - Email status tracking
  - Progress indicators for bulk operations

**Tab 1: Registered Users**
- Lists all participants from `participants` table
- Shows: Name, Email
- Actions:
  - Resend registration email
  - Generate certificate

**Tab 2: Attendance**
- Lists all attendees from `attendance` table
- Shows: Name, Email, Rating, Feedback
- Actions:
  - Send certificate to individual
  - Bulk send certificates to ALL

**Tab 3: Manual Entry**
- Manual certificate generation form
- Fields: Name, Email, Issue Date
- Generates certificate without database lookup

---

## 🧩 Components

### 1. **Navbar** (`src/components/Navbar.jsx`)
- Responsive navigation bar
- Logo and brand name
- Navigation links (Home, Programs, Register, Verify)
- Mobile hamburger menu
- Sticky positioning
- Glassmorphism effect

### 2. **Footer** (`src/components/Footer.jsx`)
- Company information
- Quick links
- Social media links
- Contact information
- Copyright notice
- Responsive layout

### 3. **AmbientBackground** (`src/components/AmbientBackground.jsx`)
- Animated gradient background
- Three.js particle effects
- Responsive to screen size
- Performance optimized

### 4. **CountdownTimer** (`src/components/CountdownTimer.jsx`)
- Real-time countdown to webinar
- Shows days, hours, minutes, seconds
- Animated number transitions
- Displays "Event Started" when time reached

### 5. **ErrorBoundary** (`src/components/ErrorBoundary.jsx`)
- Catches React errors
- Prevents app crashes
- Displays user-friendly error message
- Logs errors to console

---

## 🔧 Utilities & Services

### 1. **Supabase Client** (`src/lib/supabase.js`)
- Initializes Supabase client
- Validates environment variables
- Provides mock client if misconfigured
- Exports singleton instance

**Functions:**
```javascript
supabase.from('table_name')
  .select('*')
  .insert([data])
  .update(data)
  .delete()
```

---

### 2. **Email Trigger** (`src/utils/emailTrigger.js`)

#### Functions:

**`triggerRegistrationEmail(recipient)`**
- Sends registration confirmation email
- Parameters:
  - `recipient.name` - Recipient's name
  - `recipient.email` - Recipient's email
- Uses EmailJS template: `VITE_EMAILJS_TEMPLATE_ID_REG`
- Returns: `{ success: boolean, error?: object }`

**`triggerCertificateEmail(recipient, certificateId)`**
- Sends certificate email with download link
- Parameters:
  - `recipient.name` - Recipient's name
  - `recipient.email` - Recipient's email
  - `certificateId` - Certificate ID
- Uses EmailJS template: `VITE_EMAILJS_TEMPLATE_ID_CERT`
- Includes:
  - Certificate download link
  - Verification link
  - Certificate ID
- Returns: `{ success: boolean, error?: object }`

**`triggerWhatsAppMessage(recipient)`**
- Logs WhatsApp message intent (no auto-send capability)
- Provides click-to-chat link generation

---

### 3. **Certificate Generator** (`src/utils/generateCertificate.js`)

**`generateCertificatePDF(certData)`**
- Generates PDF certificate using jsPDF
- Parameters:
  - `certData.name` - Recipient's name
  - `certData.webinar_title` - Webinar title
  - `certData.issued_date` - Issue date
  - `certData.certificate_id` - Certificate ID
- Returns: PDF Blob

**Certificate Design:**
- Landscape A4 format (297mm x 210mm)
- Professional layout with borders
- Brand colors (pink accent: #DB2777)
- Includes:
  - Certificate title
  - Recipient name (large, italic)
  - Webinar title
  - Issue date
  - Certificate ID
  - Signature section
  - Disclaimer text

---

## ✨ Features

### User Features
1. **Easy Registration**
   - Simple form with validation
   - Instant email confirmation
   - WhatsApp integration

2. **Attendance Tracking**
   - Post-webinar attendance form
   - Rating and feedback system
   - Duplicate prevention

3. **Certificate Access**
   - Unique certificate ID
   - PDF download
   - Shareable link
   - Verification system

4. **Certificate Verification**
   - Public verification page
   - Certificate authenticity check
   - Display certificate details

### Admin Features
1. **Participant Management**
   - View all registrations
   - Export participant data
   - Resend confirmation emails

2. **Certificate Management**
   - Individual certificate generation
   - Bulk certificate sending
   - Manual certificate creation
   - Email status tracking

3. **Attendance Insights**
   - View ratings and feedback
   - Track attendance numbers
   - Analyze participant engagement

### Technical Features
1. **Responsive Design**
   - Mobile-first approach
   - Tablet and desktop optimized
   - Touch-friendly interfaces

2. **Performance**
   - Fast page loads with Vite
   - Optimized images
   - Code splitting
   - Lazy loading

3. **Error Handling**
   - Error boundaries
   - User-friendly error messages
   - Fallback UI states
   - Console logging for debugging

4. **Animations**
   - Smooth page transitions (Framer Motion)
   - Micro-interactions
   - Loading states
   - Success/error feedback

---

## 🔐 Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key

# EmailJS Template IDs
VITE_EMAILJS_TEMPLATE_ID_REG=registration-template-id
VITE_EMAILJS_TEMPLATE_ID_CERT=certificate-template-id
```

### Getting Credentials

#### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy `URL` and `anon/public` key

#### EmailJS Setup
1. Create account at [emailjs.com](https://www.emailjs.com)
2. Add email service (Gmail, Outlook, etc.)
3. Create email templates
4. Copy Service ID and Public Key

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Environment Variables**
   - Add all `.env` variables in Vercel dashboard
   - Settings → Environment Variables

### Manual Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

Build output: `dist/` folder

### Deployment Configuration

**`vercel.json`:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures client-side routing works correctly.

---

## 👤 User Workflows

### 1. Registration Workflow

```
User visits landing page (/)
    ↓
Clicks "Register Now"
    ↓
Fills registration form (/register)
    ↓
Submits form
    ↓
System checks for duplicate email
    ↓
Saves to 'participants' table
    ↓
Sends confirmation email via EmailJS
    ↓
Redirects to confirmation page (/confirmation)
    ↓
User receives email with webinar details
```

### 2. Attendance & Certificate Workflow

```
User attends webinar
    ↓
Visits attendance page (/attendance)
    ↓
Fills attendance form with rating & feedback
    ↓
Submits form
    ↓
System checks for duplicate attendance
    ↓
Saves to 'attendance' table
    ↓
Shows success message
    ↓
Admin generates certificate
    ↓
Certificate saved to 'certificates' table
    ↓
Email sent with certificate link
    ↓
User clicks link in email
    ↓
Views certificate (/certificate/:id)
    ↓
Downloads PDF
```

### 3. Certificate Verification Workflow

```
User/Employer wants to verify certificate
    ↓
Visits verification page (/verify)
    ↓
Enters certificate ID
    ↓
System queries 'certificates' table
    ↓
If found: Display certificate details
    ↓
If not found: Show error message
```

---

## 👨‍💼 Admin Workflows

### 1. Individual Certificate Generation

```
Admin logs into /admin
    ↓
Enters password: mani02112007
    ↓
Navigates to "Attendance" tab
    ↓
Clicks "Send Cert" for specific attendee
    ↓
System generates unique certificate ID
    ↓
Creates PDF using generateCertificatePDF()
    ↓
Saves to 'certificates' table
    ↓
Sends email via triggerCertificateEmail()
    ↓
Shows success message with download link
```

### 2. Bulk Certificate Sending

```
Admin logs into /admin
    ↓
Navigates to "Attendance" tab
    ↓
Clicks "Send Certificates to ALL"
    ↓
Confirms action in dialog
    ↓
System loops through all attendees
    ↓
For each attendee:
  - Generates certificate ID
  - Creates PDF
  - Saves to database
  - Sends email
  - Updates progress bar
    ↓
Shows final summary (success/failed counts)
```

### 3. Manual Certificate Creation

```
Admin logs into /admin
    ↓
Navigates to "Manual" tab
    ↓
Fills form:
  - Name
  - Email
  - Issue Date
    ↓
Clicks "Generate & Send"
    ↓
System generates certificate
    ↓
Saves to database
    ↓
Sends email (if enabled)
    ↓
Provides download link
```

### 4. Resend Emails

```
Admin logs into /admin
    ↓
Navigates to "Registered Users" tab
    ↓
Clicks email icon next to participant
    ↓
Confirms resend action
    ↓
System calls triggerRegistrationEmail()
    ↓
Shows success/failure message
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Registers
       ↓
┌─────────────────┐      ┌──────────────┐
│ Registration    │─────→│  Supabase    │
│ Page            │      │ participants │
└─────────────────┘      └──────────────┘
       │
       │ 2. Email Sent
       ↓
┌─────────────────┐
│   EmailJS       │
│ (Confirmation)  │
└─────────────────┘
       │
       │ 3. Attends Webinar
       ↓
┌─────────────────┐      ┌──────────────┐
│ Attendance      │─────→│  Supabase    │
│ Page            │      │  attendance  │
└─────────────────┘      └──────────────┘
       │
       │ 4. Admin Action
       ↓
┌─────────────────┐
│ Admin Dashboard │
└────────┬────────┘
         │
         │ 5. Generate Certificate
         ↓
┌─────────────────┐      ┌──────────────┐
│ Certificate     │─────→│  Supabase    │
│ Generator       │      │ certificates │
└────────┬────────┘      └──────────────┘
         │
         │ 6. Send Email
         ↓
┌─────────────────┐
│   EmailJS       │
│ (Certificate)   │
└─────────────────┘
         │
         │ 7. User Access
         ↓
┌─────────────────┐
│ Certificate     │
│ Preview Page    │
└─────────────────┘
```

---

## 🎨 Design System

### Colors
- **Background:** `#0a0a0a` (dark-bg)
- **Primary Brand:** `#DB2777` (pink-600)
- **Text Primary:** `#ffffff`
- **Text Secondary:** `#9ca3af` (gray-400)
- **Success:** `#10b981` (green-500)
- **Error:** `#ef4444` (red-500)
- **Warning:** `#f59e0b` (yellow-500)

### Typography
- **Font Family:** System font stack (sans-serif)
- **Headings:** Bold, large sizes
- **Body:** Regular weight, readable sizes
- **Code:** Monospace font

### Spacing
- Uses Tailwind's spacing scale (4px base unit)
- Consistent padding and margins
- Responsive spacing adjustments

### Components
- **Cards:** Glassmorphism effect with backdrop blur
- **Buttons:** Rounded, with hover states
- **Inputs:** Dark theme with focus states
- **Modals:** Centered with overlay

---

## 🧪 Testing Checklist

### User Flow Testing
- [ ] Register with valid data
- [ ] Register with duplicate email (should fail)
- [ ] Receive registration email
- [ ] Mark attendance
- [ ] Mark attendance twice (should prevent duplicate)
- [ ] Receive certificate email
- [ ] Download certificate PDF
- [ ] Verify certificate with valid ID
- [ ] Verify certificate with invalid ID

### Admin Flow Testing
- [ ] Login to admin panel
- [ ] View registered users
- [ ] View attendance list
- [ ] Generate individual certificate
- [ ] Bulk send certificates
- [ ] Manual certificate creation
- [ ] Resend registration email
- [ ] Resend certificate email

### Responsive Testing
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🐛 Common Issues & Solutions

### Issue: Emails not sending
**Solution:**
1. Check EmailJS credentials in `.env`
2. Verify EmailJS templates are published
3. Check browser console for errors
4. Ensure email service is connected in EmailJS dashboard

### Issue: Database errors
**Solution:**
1. Verify Supabase credentials in `.env`
2. Check table names match exactly
3. Ensure Row Level Security (RLS) policies allow operations
4. Check Supabase dashboard for error logs

### Issue: Certificate not generating
**Solution:**
1. Check browser console for jsPDF errors
2. Verify certificate data is complete
3. Ensure logo assets are accessible
4. Check PDF generation function for errors

### Issue: Routing not working after deployment
**Solution:**
1. Ensure `vercel.json` has correct rewrites
2. Check that all routes are defined in `App.jsx`
3. Verify build output includes all necessary files

---

## 📞 Support & Contact

**Developer:** Tech Stack Team  
**Email:** support@techstack.com  
**Website:** [Your Website URL]

---

## 📝 License

This project is proprietary and confidential.  
© 2026 Tech Stack. All rights reserved.

---

## 🔄 Version History

- **v1.0.0** (2026-02-04) - Initial release
  - User registration system
  - Attendance tracking
  - Certificate generation
  - Admin dashboard
  - Email automation

---

## 🚧 Future Enhancements

### Planned Features
1. **User Authentication**
   - User login system
   - Personal dashboard
   - View own certificates

2. **Analytics Dashboard**
   - Registration statistics
   - Attendance rates
   - Feedback analysis
   - Email delivery rates

3. **Multiple Webinars**
   - Support for multiple events
   - Event management system
   - Calendar integration

4. **Advanced Certificate Templates**
   - Multiple certificate designs
   - Custom branding options
   - Template editor

5. **Payment Integration**
   - Paid webinars
   - Stripe/PayPal integration
   - Invoice generation

6. **Social Features**
   - Share certificates on social media
   - Participant networking
   - Discussion forums

7. **Mobile App**
   - React Native mobile app
   - Push notifications
   - Offline access to certificates

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [EmailJS Documentation](https://www.emailjs.com/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Framer Motion Documentation](https://www.framer.com/motion)

---

**Last Updated:** February 4, 2026  
**Documentation Version:** 1.0.0
