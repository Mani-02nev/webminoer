# 🚀 React Webinar Registration - Frontend Only (Supabase)

## ✅ Pure React + Supabase Solution

This is a **frontend-only** React application that connects directly to Supabase - **no backend server needed**! Perfect for Vercel deployment.

---

## 🎯 Quick Start (2 Steps!)

### Step 1: Get Your Supabase Anon Key

1. Go to: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf/settings/api
2. Under "Project API keys", copy the **anon** **public** key
3. Update `.env` file:

```bash
VITE_SUPABASE_ANON_KEY=paste_your_full_anon_key_here
```

### Step 2: Create Database Table

1. Go to: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf/sql
2. Click **SQL Editor** → **New Query**
3. Run this SQL (or use the `supabase-setup.sql` file):

```sql
-- Create participants table
CREATE TABLE IF NOT EXISTS public.participants (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    dob DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Student', 'Working Professional')),
    college TEXT,
    year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for webinar registration form)
CREATE POLICY "allow_insert_webinar_form" ON public.participants
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create policy to allow public reads (for seat count)
CREATE POLICY "Allow public reads" ON public.participants
    FOR SELECT TO anon
    USING (true);
```

### Step 3: Run Locally

```bash
npm run dev
```

Open http://localhost:5173 and test! 🎉

---

## 🌐 Deploy to Vercel

### Option 1: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL` = `https://iihurfyxvqiukwndsnpf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = Your anon key
5. Click **Deploy**!

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted
```

---

## 📁 Project Structure

```
webinar-react/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client configuration
│   ├── pages/
│   │   ├── LandingPage.jsx      # Uses participants table
│   │   ├── RegistrationPage.jsx # Uses participants table
│   │   ├── ConfirmationPage.jsx
│   │   └── AboutPage.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── CountdownTimer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                         # Supabase credentials
├── package.json
├── vite.config.js
├── vercel.json                  # Vercel deployment config
└── supabase-setup.sql           # Database setup SQL
```

---

### 🔧 Database Schema

### Table: `public.participants` (User Provided)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| name | TEXT | Not Null |
| email | TEXT | Nullable |
| whatsapp | TEXT | Default '' |
| experience | TEXT | Mapped from 'Status' |
| college | TEXT | Nullable |
| current_year | TEXT | Mapped from 'Year' |
| created_at | TIMESTAMPTZ | Default NOW() |

### RLS Policies

1. **allow_insert_webinar_form** - Allows public inserts for registration
2. **Allow public reads** - Allows public reads for seat count

---

## 🔒 How It Works

### Direct Supabase Connection

The app connects directly to Supabase from the browser:

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Registration Flow

```javascript
// src/pages/RegistrationPage.jsx
import { supabase } from '../lib/supabase';

// Fetch seat count
const { count } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true });

// Insert registration
const { error } = await supabase
    .from('participants')
    .insert([registration]);
```

### Security

- ✅ **Row Level Security (RLS)** enabled on Supabase
- ✅ **Public policies** allow inserts and reads
- ✅ **Anon key** is safe to expose in frontend
- ✅ **Email validation** prevents duplicates
- ✅ **Seat limit** enforced in application

---

## ✅ Features

- ✅ **No backend server** - Pure React frontend
- ✅ **Direct Supabase connection** - Fast and reliable
- ✅ **Real-time seat availability** - Updates automatically
- ✅ **Email validation** - Gmail only
- ✅ **Duplicate prevention** - Email uniqueness enforced
- ✅ **Seat limit** - Maximum 100 registrations
- ✅ **Form validation** - Client-side validation
- ✅ **Responsive design** - Works on all devices
- ✅ **Easy deployment** - One-click Vercel deploy

---

## 🎨 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

---

## 📊 Environment Variables

Only 2 environment variables needed:

```bash
VITE_SUPABASE_URL=https://iihurfyxvqiukwndsnpf.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note**: The `VITE_` prefix is required for Vite to expose them to the browser.

---

## 🐛 Troubleshooting

### "Supabase credentials not found"
→ Make sure `.env` file exists with both variables

### "Table does not exist" (404 error)
→ Run the SQL script in Supabase SQL Editor to create `participants` table

### "Row-level security policy violation"
→ Make sure RLS policies are created (check the SQL script)

### Form submits but no data appears
→ Check Supabase Table Editor → `participants` table to verify data

### Deployment fails on Vercel
→ Make sure environment variables are added in Vercel dashboard

---

## 📚 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🎯 Supabase Dashboard Links

- **Dashboard**: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf
- **API Settings**: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf/sql
- **Table Editor**: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf/editor

---

## ✅ Deployment Checklist

Before deploying to Vercel:

- [ ] Supabase `participants` table created
- [ ] RLS policies configured (`allow_insert_webinar_form`, `Allow public reads`)
- [ ] Anon key copied from Supabase
- [ ] `.env` file updated locally (for testing)
- [ ] Code pushed to GitHub
- [ ] Environment variables added in Vercel
- [ ] Deployment successful
- [ ] Form tested on production URL
- [ ] Data verified in Supabase Table Editor

---

## 🎉 Benefits of This Approach

### vs Backend Server:
- ✅ **Simpler** - No server to maintain
- ✅ **Faster** - Direct database connection
- ✅ **Cheaper** - No server costs
- ✅ **Easier deployment** - Just static files
- ✅ **Better performance** - No API latency

### vs MongoDB:
- ✅ **No connection issues** - Simple URL + Key
- ✅ **Better dashboard** - View/edit data easily
- ✅ **Built-in security** - RLS out of the box
- ✅ **More features** - Auth, Storage, Realtime available

---

## 🚀 Next Steps

1. ✅ Update `.env` with your anon key
2. ✅ Create the `participants` table with RLS policies
3. ✅ Test locally with `npm run dev`
4. ✅ Push to GitHub
5. ✅ Deploy to Vercel
6. ✅ Add environment variables in Vercel
7. ✅ Test on production URL
8. ✅ Check data in Supabase Table Editor

---

## 📖 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/
- **Vercel Docs**: https://vercel.com/docs
- **React Router**: https://reactrouter.com/

---

**All set!** This is now a pure frontend React app that connects directly to Supabase. No backend needed! 🎉

Just update your anon key, create the `participants` table, and deploy to Vercel! 🚀
