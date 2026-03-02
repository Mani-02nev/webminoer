# System Architecture - React Webinar Platform

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                     (React + Vite + Tailwind)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────────┐                  ┌───────────────────┐
│   SUPABASE API    │                  │    EMAILJS API    │
│   (PostgreSQL)    │                  │  (Email Service)  │
└───────────────────┘                  └───────────────────┘
        │                                       │
        │                                       │
        ▼                                       ▼
┌───────────────────┐                  ┌───────────────────┐
│   Database        │                  │   Email Provider  │
│   - participants  │                  │   (Gmail/SMTP)    │
│   - attendance    │                  └───────────────────┘
│   - certificates  │
└───────────────────┘
```

---

## 📱 Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                            App.jsx                               │
│                    (Main Router Component)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Navbar     │    │    Routes    │    │   Footer     │
└──────────────┘    └──────┬───────┘    └──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Public Pages │    │ Auth Pages   │    │  Components  │
│              │    │              │    │              │
│ - Landing    │    │ - Admin      │    │ - Timer      │
│ - Register   │    │              │    │ - Background │
│ - Attendance │    │              │    │ - Error      │
│ - Certificate│    │              │    │   Boundary   │
│ - Verify     │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🔄 Data Flow Architecture

### Registration Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Fills Form
     ▼
┌─────────────────┐
│ Registration    │
│ Page Component  │
└────┬────────────┘
     │
     │ 2. Form Submit
     ▼
┌─────────────────┐
│  Validation     │
│  (Client-side)  │
└────┬────────────┘
     │
     │ 3. POST Request
     ▼
┌─────────────────┐
│  Supabase API   │
│  Insert Query   │
└────┬────────────┘
     │
     │ 4. Save to DB
     ▼
┌─────────────────┐
│  participants   │
│     Table       │
└────┬────────────┘
     │
     │ 5. Success Response
     ▼
┌─────────────────┐
│  Email Trigger  │
│  Function       │
└────┬────────────┘
     │
     │ 6. Send Email
     ▼
┌─────────────────┐
│   EmailJS API   │
└────┬────────────┘
     │
     │ 7. Email Delivered
     ▼
┌─────────────────┐
│  User's Inbox   │
└─────────────────┘
```

---

### Certificate Generation Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Clicks "Send Cert"
     ▼
┌─────────────────────┐
│ Admin Dashboard     │
│ handleCreateCert()  │
└────┬────────────────┘
     │
     │ 2. Generate ID
     ▼
┌─────────────────────┐
│ generateCertId()    │
│ TT-REACT-YYYY-XXXX  │
└────┬────────────────┘
     │
     │ 3. Create PDF
     ▼
┌─────────────────────┐
│ generateCertPDF()   │
│ (jsPDF Library)     │
└────┬────────────────┘
     │
     │ 4. Save to DB
     ▼
┌─────────────────────┐
│ Supabase Insert     │
│ certificates table  │
└────┬────────────────┘
     │
     │ 5. Send Email
     ▼
┌─────────────────────┐
│ triggerCertEmail()  │
│ (EmailJS)           │
└────┬────────────────┘
     │
     │ 6. Email with Link
     ▼
┌─────────────────────┐
│ User Receives Email │
│ /certificate/:id    │
└─────────────────────┘
```

---

## 🗂 File Structure Hierarchy

```
webinar-react/
│
├── 📄 Configuration Files
│   ├── package.json          (Dependencies)
│   ├── vite.config.js        (Build config)
│   ├── tailwind.config.js    (Styles config)
│   ├── vercel.json           (Deployment config)
│   └── .env                  (Environment variables)
│
├── 📁 public/                (Static assets)
│   └── react-logo.png
│
├── 📁 src/
│   │
│   ├── 📁 assets/            (Images, logos)
│   │   ├── logo.png
│   │   ├── logoBase64.js
│   │   └── react.jpg
│   │
│   ├── 📁 components/        (Reusable UI components)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CountdownTimer.jsx
│   │   ├── AmbientBackground.jsx
│   │   └── ErrorBoundary.jsx
│   │
│   ├── 📁 pages/             (Route components)
│   │   ├── LandingPage.jsx
│   │   ├── RegistrationPage.jsx
│   │   ├── ConfirmationPage.jsx
│   │   ├── AttendancePage.jsx
│   │   ├── CertificatePreviewPage.jsx
│   │   ├── VerifyCertificatePage.jsx
│   │   ├── AdminGeneratorPage.jsx
│   │   ├── ProgramsPage.jsx
│   │   └── AboutPage.jsx
│   │
│   ├── 📁 lib/               (Third-party integrations)
│   │   └── supabase.js
│   │
│   ├── 📁 utils/             (Helper functions)
│   │   ├── emailTrigger.js
│   │   └── generateCertificate.js
│   │
│   ├── 📄 App.jsx            (Main app component)
│   ├── 📄 main.jsx           (Entry point)
│   ├── 📄 index.css          (Global styles)
│   └── 📄 App.css            (App styles)
│
└── 📁 Documentation/
    ├── WEBSITE_DOCUMENTATION.md
    ├── QUICK_REFERENCE.md
    ├── CERTIFICATE_SENDING_GUIDE.md
    └── DEPLOYMENT.md
```

---

## 🔌 API Integration Points

### Supabase Integration

```javascript
// Location: src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY
);

// Usage across app:
// - RegistrationPage.jsx
// - AttendancePage.jsx
// - CertificatePreviewPage.jsx
// - VerifyCertificatePage.jsx
// - AdminGeneratorPage.jsx
```

### EmailJS Integration

```javascript
// Location: src/utils/emailTrigger.js

import emailjs from '@emailjs/browser';

// Registration Email
emailjs.send(
  SERVICE_ID,
  TEMPLATE_ID_REG,
  templateParams,
  PUBLIC_KEY
);

// Certificate Email
emailjs.send(
  SERVICE_ID,
  TEMPLATE_ID_CERT,
  templateParams,
  PUBLIC_KEY
);

// Used in:
// - RegistrationPage.jsx
// - AdminGeneratorPage.jsx
```

---

## 🎨 Component Dependency Graph

```
App.jsx
│
├─── Navbar
│    └─── (No dependencies)
│
├─── Routes
│    │
│    ├─── LandingPage
│    │    ├─── CountdownTimer
│    │    └─── AmbientBackground
│    │
│    ├─── RegistrationPage
│    │    ├─── supabase
│    │    └─── emailTrigger
│    │
│    ├─── AttendancePage
│    │    └─── supabase
│    │
│    ├─── CertificatePreviewPage
│    │    ├─── supabase
│    │    └─── generateCertificate
│    │
│    ├─── VerifyCertificatePage
│    │    └─── supabase
│    │
│    └─── AdminGeneratorPage
│         ├─── supabase
│         ├─── emailTrigger
│         └─── generateCertificate
│
└─── Footer
     └─── (No dependencies)
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
└─────────────────────────────────────────────────────────────┘

1. Environment Variables
   ├─── Stored in .env (not in git)
   ├─── Accessed via import.meta.env
   └─── Set in Vercel dashboard for production

2. Supabase Row Level Security (RLS)
   ├─── Public read access for certificates
   ├─── Authenticated write access
   └─── Admin-only operations

3. Admin Authentication
   ├─── Password-protected admin route
   ├─── Client-side password check
   └─── Future: JWT-based auth

4. Email Security
   ├─── EmailJS API keys
   ├─── Rate limiting on EmailJS side
   └─── Template-based emails (prevent injection)

5. Input Validation
   ├─── Client-side form validation
   ├─── Email format validation
   ├─── Duplicate prevention
   └─── SQL injection prevention (Supabase handles)
```

---

## 📊 Database Schema Relationships

```
┌─────────────────────┐
│   participants      │
│                     │
│ - id (PK)           │
│ - name              │
│ - email (UNIQUE)    │◄────┐
│ - college           │     │
│ - whatsapp          │     │
│ - current_year      │     │
│ - created_at        │     │
└─────────────────────┘     │
                            │
                            │ (Linked by email)
                            │
┌─────────────────────┐     │
│   attendance        │     │
│                     │     │
│ - id (PK)           │     │
│ - name              │     │
│ - email (UNIQUE)    │─────┤
│ - whatsapp          │     │
│ - rating            │     │
│ - feedback          │     │
│ - created_at        │     │
└─────────────────────┘     │
                            │
                            │
┌─────────────────────┐     │
│   certificates      │     │
│                     │     │
│ - id (PK)           │     │
│ - certificate_id    │     │
│   (UNIQUE)          │     │
│ - name              │     │
│ - email             │─────┘
│ - webinar_title     │
│ - issued_date       │
│ - is_completed      │
│ - conducted_by      │
│ - created_at        │
└─────────────────────┘

Note: Tables are linked by email address
      but no formal foreign key constraints
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                               │
│                                                              │
│  Local Machine                                               │
│  ├─── npm run dev (Vite Dev Server)                         │
│  ├─── Hot Module Replacement                                │
│  └─── Local .env file                                       │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ git push
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERSION CONTROL                           │
│                                                              │
│  GitHub Repository                                           │
│  ├─── main branch                                           │
│  ├─── pages branch                                          │
│  └─── .gitignore (.env excluded)                            │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Auto-deploy
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION                                │
│                                                              │
│  Vercel Platform                                             │
│  ├─── Build: npm run build                                  │
│  ├─── Output: dist/ folder                                  │
│  ├─── Environment Variables (from dashboard)                │
│  ├─── CDN Distribution                                      │
│  └─── HTTPS Certificate                                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Serves to
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    END USERS                                 │
│                                                              │
│  Browser (Chrome, Firefox, Safari, Edge)                    │
│  ├─── Desktop                                               │
│  ├─── Tablet                                                │
│  └─── Mobile                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                          │
└─────────────────────────────────────────────────────────────┘

1. Component State (useState)
   ├─── Form inputs
   ├─── Loading states
   ├─── Error messages
   └─── Success messages

2. URL State (React Router)
   ├─── Current route
   ├─── URL parameters (:id)
   └─── Query parameters (?download=true)

3. Server State (Supabase)
   ├─── Participants data
   ├─── Attendance data
   └─── Certificates data

4. Session State
   ├─── Admin authentication
   └─── Form data persistence

Note: No global state management (Redux/Context)
      as app is relatively simple
```

---

## 📈 Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                PERFORMANCE STRATEGIES                        │
└─────────────────────────────────────────────────────────────┘

1. Build Optimization
   ├─── Vite's fast build process
   ├─── Code splitting by route
   ├─── Tree shaking unused code
   └─── Minification and compression

2. Asset Optimization
   ├─── Image compression
   ├─── Base64 encoding for small images
   ├─── Lazy loading images
   └─── CDN delivery via Vercel

3. Runtime Optimization
   ├─── React 19 compiler optimizations
   ├─── Framer Motion GPU acceleration
   ├─── Debounced form inputs
   └─── Memoization where needed

4. Database Optimization
   ├─── Indexed email columns
   ├─── Efficient queries (select specific fields)
   ├─── Pagination for large lists
   └─── Connection pooling (Supabase)

5. Caching
   ├─── Browser caching (Vercel headers)
   ├─── Service worker (future enhancement)
   └─── API response caching
```

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    TESTING LAYERS                            │
└─────────────────────────────────────────────────────────────┘

1. Manual Testing
   ├─── User flow testing
   ├─── Cross-browser testing
   ├─── Responsive design testing
   └─── Admin workflow testing

2. Error Handling
   ├─── ErrorBoundary component
   ├─── Try-catch blocks
   ├─── User-friendly error messages
   └─── Console logging for debugging

3. Validation
   ├─── Client-side form validation
   ├─── Email format validation
   ├─── Required field validation
   └─── Duplicate prevention

4. Future Testing (Recommended)
   ├─── Unit tests (Vitest)
   ├─── Integration tests
   ├─── E2E tests (Playwright)
   └─── Performance testing
```

---

## 📱 Responsive Design Breakpoints

```
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSIVE BREAKPOINTS                      │
└─────────────────────────────────────────────────────────────┘

Mobile First Approach:

1. Mobile (Default)
   └─── 320px - 767px
        ├─── Single column layouts
        ├─── Hamburger menu
        ├─── Stacked forms
        └─── Full-width buttons

2. Tablet (md:)
   └─── 768px - 1023px
        ├─── Two column layouts
        ├─── Expanded navigation
        ├─── Side-by-side forms
        └─── Larger typography

3. Desktop (lg:)
   └─── 1024px+
        ├─── Multi-column layouts
        ├─── Full navigation
        ├─── Optimized spacing
        └─── Maximum content width

Tailwind Breakpoints Used:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

---

## 🎯 User Personas & Journeys

```
┌─────────────────────────────────────────────────────────────┐
│                    USER PERSONAS                             │
└─────────────────────────────────────────────────────────────┘

1. Student (Primary User)
   ├─── Registers for webinar
   ├─── Attends session
   ├─── Marks attendance
   ├─── Receives certificate
   └─── Shares certificate

2. Admin (Secondary User)
   ├─── Manages registrations
   ├─── Generates certificates
   ├─── Sends bulk emails
   └─── Monitors attendance

3. Employer/Verifier (Tertiary User)
   ├─── Receives certificate from candidate
   ├─── Visits verification page
   ├─── Enters certificate ID
   └─── Validates authenticity
```

---

**Last Updated:** February 4, 2026  
**Architecture Version:** 1.0.0
