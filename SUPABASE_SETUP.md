# 🚀 Supabase Setup Guide - Complete & Working

## ✅ What's Been Done

Your application has been **completely migrated from MongoDB to Supabase**! Here's what changed:

- ✅ Removed all MongoDB dependencies
- ✅ Added Supabase client library
- ✅ Updated server.js to use Supabase
- ✅ Updated API functions (register.js, seats.js)
- ✅ Updated .env configuration
- ✅ Created test script for Supabase connection

---

## 🎯 Quick Setup (4 Steps)

### Step 1: Get Your Supabase Anon Key

The key you provided seems incomplete. Let's get the correct one:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf
2. Click on **Settings** (gear icon in sidebar)
3. Click on **API**
4. Under "Project API keys", find **anon** **public** key
5. Copy the full key (it should be a long JWT token starting with `eyJ...`)

**It should look like this:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHVyZnl4dnFpdWt3bmRzbnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTk4OTUsImV4cCI6MjA1Mzk5NTg5NX0.SIGNATURE_PART_HERE
```

### Step 2: Update Your `.env` File

Replace the `VITE_SUPABASE_ANON_KEY` in your `.env` file with the correct anon key:

```bash
# Backend API URL (used by frontend)
VITE_API_URL=http://localhost:3001/api

# Supabase Configuration
VITE_SUPABASE_URL=https://iihurfyxvqiukwndsnpf.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Server Port
PORT=3001
```

### Step 3: Create the Database Table

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
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
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for registration)
CREATE POLICY "Allow public inserts" ON registrations
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create policy to allow public reads (for seat count)
CREATE POLICY "Allow public reads" ON registrations
    FOR SELECT TO anon
    USING (true);
```

5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### Step 4: Test & Run

```bash
# Test your Supabase connection
npm run test:db

# If test passes, start the application
npm run dev:all
```

---

## 📋 Detailed Instructions

### Finding Your Anon Key

**Method 1: Via Dashboard**
1. Dashboard → Settings → API
2. Look for "Project API keys"
3. Find the **anon** **public** key
4. Click the copy icon

**Method 2: Via Project Settings**
1. Dashboard → Project Settings
2. API tab
3. Copy the "anon public" key

### Understanding Supabase Keys

Supabase provides different keys:

- **anon (public) key**: Safe to use in frontend code, has limited permissions
- **service_role key**: Full access, NEVER expose in frontend (only use in backend if needed)

For this project, we only need the **anon public key**.

### Creating the Table

The SQL script above creates:

1. **registrations table** with all necessary fields
2. **Index on email** for fast duplicate checking
3. **Row Level Security (RLS)** enabled for security
4. **Policies** to allow:
   - Anyone to insert (register)
   - Anyone to read (check seat count)

### Verifying Table Creation

After running the SQL:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see the `registrations` table
3. Click on it to see the structure
4. Initially, it will be empty (0 rows)

---

## 🧪 Testing Your Setup

### Test Connection

```bash
npm run test:db
```

**Expected Success Output:**
```
🧪 Testing Supabase Connection...

✅ Supabase credentials found in .env
📦 Project URL: https://iihurfyxvqiukwndsnpf.supabase.co

🔄 Connecting to Supabase...
✅ Successfully connected to Supabase!
✅ Table "registrations" exists
📊 Current registrations: 0
📊 Available seats: 100/100

✅ Connection test successful!
🚀 You can now run: npm run dev:all
```

**If Table Doesn't Exist:**
The script will show you the SQL to create it.

### Test the Server

```bash
npm run server
```

**Expected Output:**
```
🔄 Testing Supabase connection...
✅ Connected to Supabase successfully!
📦 Project: https://iihurfyxvqiukwndsnpf.supabase.co
🚀 Server running on http://localhost:3001
📡 API endpoints available at http://localhost:3001/api

💡 Tip: Visit http://localhost:3001/api/health to check server status
```

### Test the Full Application

```bash
npm run dev:all
```

Then:
1. Open http://localhost:5173
2. Navigate to registration page
3. Fill out the form
4. Submit!

---

## 🐛 Troubleshooting

### Error: "Connection test failed" with empty error message

**Problem:** The anon key might be incorrect or incomplete.

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **full** anon public key
3. Update `.env` file
4. Run `npm run test:db` again

---

### Error: "Table does not exist"

**Problem:** The `registrations` table hasn't been created yet.

**Solution:**
1. Run the SQL script from Step 3 above
2. Verify in Table Editor that the table exists
3. Run `npm run test:db` again

---

### Error: "new row violates row-level security policy"

**Problem:** RLS policies are not set up correctly.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Policies
2. Make sure the two policies exist:
   - "Allow public inserts"
   - "Allow public reads"
3. If not, run the SQL script again

---

### Form Submits But No Data in Supabase

**Problem:** RLS policies might be blocking inserts.

**Solution:**
1. Check Supabase Dashboard → Table Editor → registrations
2. If empty, check the policies
3. Try disabling RLS temporarily to test:
   ```sql
   ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
   ```
4. Test again, then re-enable RLS and add policies

---

### Port Already in Use

**Solution:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## 📊 Viewing Your Data

### In Supabase Dashboard

1. Go to **Table Editor**
2. Click on **registrations** table
3. See all submitted registrations
4. You can:
   - View all data
   - Edit rows
   - Delete rows
   - Export as CSV

### Via API

```bash
# Check seat availability
curl http://localhost:3001/api/seats

# Health check
curl http://localhost:3001/api/health
```

---

## 🌐 Deployment to Vercel

Once everything works locally:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://iihurfyxvqiukwndsnpf.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
4. Deploy!

The API functions in `/api` folder will work as Vercel serverless functions.

---

## ✅ Success Checklist

- [ ] Got correct anon key from Supabase Dashboard
- [ ] Updated `.env` with correct anon key
- [ ] Created `registrations` table in Supabase
- [ ] Set up RLS policies
- [ ] `npm run test:db` passes
- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Form submits successfully
- [ ] Data appears in Supabase Table Editor

---

## 🎉 Benefits of Supabase vs MongoDB

- ✅ **No connection string issues** - Just URL + Key
- ✅ **Built-in dashboard** - View/edit data easily
- ✅ **Real-time updates** - Can add live features later
- ✅ **Row Level Security** - Better security out of the box
- ✅ **PostgreSQL** - More powerful than MongoDB for this use case
- ✅ **Free tier** - Generous limits for development
- ✅ **Easier deployment** - Works seamlessly with Vercel

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Your Project**: https://supabase.com/dashboard/project/iihurfyxvqiukwndsnpf

---

## 🚀 Quick Commands Reference

```bash
# Test Supabase connection
npm run test:db

# Start backend only
npm run server

# Start frontend only
npm run dev

# Start both (recommended)
npm run dev:all

# Build for production
npm run build
```

---

**Need Help?** 
1. Check the troubleshooting section above
2. Verify your anon key is correct
3. Make sure the table and policies are created
4. Check Supabase Dashboard for any errors

**Ready to go?** Just get your correct anon key, update `.env`, create the table, and run `npm run dev:all`! 🎉
