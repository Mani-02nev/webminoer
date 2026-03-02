# Quick Reference Guide - React Webinar Platform

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔑 Admin Access

**URL:** `/admin`  
**Password:** `mani02112007`

---

## 📍 All Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/register` | Registration Form | Public |
| `/confirmation` | Registration Success | Public |
| `/attendance` | Attendance Form | Public |
| `/certificate/:id` | Certificate Preview | Public |
| `/verify` or `/verify/:id` | Certificate Verification | Public |
| `/programs` | Programs Listing | Public |
| `/admin` | Admin Dashboard | Password Protected |

---

## 📊 Database Tables

### participants
- Stores registration data
- Fields: name, email, college, whatsapp, current_year

### attendance
- Tracks webinar attendance
- Fields: name, email, whatsapp, rating, feedback

### certificates
- Stores generated certificates
- Fields: certificate_id, name, email, webinar_title, issued_date

---

## 🔧 Key Functions

### Email Functions (`src/utils/emailTrigger.js`)
```javascript
// Send registration email
triggerRegistrationEmail({ name, email })

// Send certificate email
triggerCertificateEmail({ name, email }, certificateId)
```

### Certificate Generation (`src/utils/generateCertificate.js`)
```javascript
// Generate PDF certificate
generateCertificatePDF({
  name,
  webinar_title,
  issued_date,
  certificate_id
})
```

---

## 🎨 Tailwind Custom Classes

```css
.card-glass          /* Glassmorphism card */
.btn-primary         /* Primary button */
.input-field         /* Form input */
.heading-lg          /* Large heading */
.layout-container    /* Max-width container */
```

---

## 📧 Email Templates Required

### Registration Template
- Template ID: `VITE_EMAILJS_TEMPLATE_ID_REG`
- Variables: `{{name}}`, `{{to_email}}`, `{{date}}`, `{{webinar_time}}`

### Certificate Template
- Template ID: `VITE_EMAILJS_TEMPLATE_ID_CERT`
- Variables: `{{name}}`, `{{to_email}}`, `{{certificate_link}}`, `{{verify_link}}`, `{{certificate_id}}`

---

## 🔐 Environment Variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_TEMPLATE_ID_REG=
VITE_EMAILJS_TEMPLATE_ID_CERT=
```

---

## 📱 Component Import Paths

```javascript
// Pages
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import AttendancePage from './pages/AttendancePage';
import CertificatePreviewPage from './pages/CertificatePreviewPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import AdminGeneratorPage from './pages/AdminGeneratorPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CountdownTimer from './components/CountdownTimer';
import AmbientBackground from './components/AmbientBackground';
import ErrorBoundary from './components/ErrorBoundary';

// Utils
import { supabase } from './lib/supabase';
import { triggerRegistrationEmail, triggerCertificateEmail } from './utils/emailTrigger';
import { generateCertificatePDF } from './utils/generateCertificate';
```

---

## 🐛 Common Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run lint

# Git commands
git status
git add .
git commit -m "message"
git push origin main

# Deploy to Vercel
vercel --prod
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI Framework |
| vite | 7.2.4 | Build Tool |
| tailwindcss | 3.4.19 | Styling |
| framer-motion | 12.31.0 | Animations |
| @supabase/supabase-js | 2.39.7 | Database |
| @emailjs/browser | 4.4.1 | Email Service |
| jspdf | 4.1.0 | PDF Generation |
| react-router-dom | 7.13.0 | Routing |
| lucide-react | 0.563.0 | Icons |

---

## 🎯 User Journey

1. **Register** → `/register`
2. **Receive Email** → Confirmation
3. **Attend Webinar** → Live session
4. **Mark Attendance** → `/attendance`
5. **Admin Generates Certificate** → `/admin`
6. **Receive Certificate Email** → With download link
7. **View/Download Certificate** → `/certificate/:id`

---

## 👨‍💼 Admin Tasks

### Send Individual Certificate
1. Login to `/admin`
2. Go to "Attendance" tab
3. Click "Send Cert" next to attendee

### Bulk Send Certificates
1. Login to `/admin`
2. Go to "Attendance" tab
3. Click "Send Certificates to ALL"
4. Confirm action

### Manual Certificate
1. Login to `/admin`
2. Go to "Manual" tab
3. Fill form and submit

---

## 🎨 Color Palette

```javascript
// Tailwind Config
colors: {
  'dark-bg': '#0a0a0a',
  'brand': {
    500: '#DB2777',  // Pink
    600: '#BE185D',
  },
  'text-primary': '#ffffff',
  'text-secondary': '#9ca3af',
}
```

---

## 📝 Certificate ID Format

```
TT-REACT-YYYY-XXXX

Example: TT-REACT-2026-1234
```

- `TT` = Times Tech
- `REACT` = Webinar topic
- `YYYY` = Year
- `XXXX` = Random 4-digit number

---

## 🔍 Debugging Tips

### Check Supabase Connection
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### Check EmailJS
```javascript
console.log('EmailJS Service:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
```

### Test Certificate Generation
```javascript
const pdf = generateCertificatePDF({
  name: 'Test User',
  webinar_title: 'React Roadmap',
  issued_date: '2026-02-15',
  certificate_id: 'TT-REACT-2026-TEST'
});
```

---

## 📞 Support

For detailed documentation, see:
- `WEBSITE_DOCUMENTATION.md` - Complete documentation
- `CERTIFICATE_SENDING_GUIDE.md` - Certificate sending guide
- `DEPLOYMENT.md` - Deployment instructions
- `EMAILJS_TROUBLESHOOTING.md` - Email troubleshooting

---

**Last Updated:** February 4, 2026
