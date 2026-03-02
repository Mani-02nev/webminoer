# 🚀 Deployment Guide - Tech Stack Webinar Platform

## Prerequisites Checklist

- [ ] MongoDB Atlas account created
- [ ] Vercel account created
- [ ] Git repository initialized
- [ ] All code committed to Git

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Verify your email

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to your users
5. Name your cluster (e.g., `webinar-cluster`)
6. Click "Create Cluster"

### 1.3 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Username: `webinar_admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 1.4 Whitelist IP Addresses
1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<dbname>` with `webinar_platform`

**Example:**
```
mongodb+srv://webinar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/webinar_platform?retryWrites=true&w=majority
```

### 1.6 Create Database and Collection
1. Click "Browse Collections"
2. Click "Add My Own Data"
3. Database name: `webinar_platform`
4. Collection name: `registrations`
5. Click "Create"

### 1.7 Create Unique Index
1. Go to your `registrations` collection
2. Click "Indexes" tab
3. Click "Create Index"
4. Field: `email`
5. Type: `1` (ascending)
6. Options: Check "Unique"
7. Click "Create"

---

## Step 2: Local Testing

### 2.1 Update .env File
Create or update `.env` in your project root:

```env
MONGODB_URI=mongodb+srv://webinar_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/webinar_platform?retryWrites=true&w=majority
NODE_ENV=development
```

### 2.2 Test Locally
```bash
npm run dev
```

### 2.3 Test Registration
1. Open http://localhost:5173
2. Navigate to Register page
3. Fill out the form with test data
4. Submit registration
5. Check MongoDB Atlas to verify data was saved

---

## Step 3: Prepare for Deployment

### 3.1 Update .gitignore
Ensure `.env` is in `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules

# Build output
dist
dist-ssr
*.local

# Logs
logs
*.log
npm-debug.log*

# Editor directories
.vscode
.idea
```

### 3.2 Build Test
```bash
npm run build
```

Ensure build completes without errors.

### 3.3 Preview Build
```bash
npm run preview
```

Test the production build locally.

---

## Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 4.2 Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your Git repository
   - Select the repository

3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add variable:
     - Name: `MONGODB_URI`
     - Value: Your MongoDB connection string
     - Environment: Production, Preview, Development
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)

### 4.3 Deploy via Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `webinar-react` (or your choice)
- Directory? `./`
- Override settings? **N**

---

## Step 5: Configure Environment Variables in Vercel

### Via Dashboard:
1. Go to your project on Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Add:
   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string
   - **Environment:** Production, Preview, Development
5. Click "Save"

### Via CLI:
```bash
vercel env add MONGODB_URI production
# Paste your MongoDB URI when prompted
```

---

## Step 6: Verify Deployment

### 6.1 Check Deployment URL
Your app will be deployed at:
```
https://your-project-name.vercel.app
```

### 6.2 Test All Features
- [ ] Landing page loads correctly
- [ ] About page displays properly
- [ ] Registration form works
- [ ] Form validation functions
- [ ] Seat availability updates
- [ ] Duplicate email prevention works
- [ ] Confirmation page shows after registration
- [ ] WhatsApp link works
- [ ] Theme toggle works
- [ ] Mobile responsive design

### 6.3 Test API Endpoints
```bash
# Test seats endpoint
curl https://your-project-name.vercel.app/api/seats

# Test registration (use a tool like Postman)
POST https://your-project-name.vercel.app/api/register
```

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain
1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your domain name
4. Follow DNS configuration instructions

### 7.2 Configure DNS
Add these records to your domain provider:
- **Type:** A
- **Name:** @
- **Value:** 76.76.21.21

Or use CNAME:
- **Type:** CNAME
- **Name:** www
- **Value:** cname.vercel-dns.com

---

## Step 8: Post-Deployment

### 8.1 Monitor Logs
```bash
vercel logs
```

Or check logs in Vercel Dashboard → Deployments → View Function Logs

### 8.2 Set Up Analytics (Optional)
1. Go to Project Settings → Analytics
2. Enable Vercel Analytics
3. Add analytics script to your app

### 8.3 Enable Speed Insights (Optional)
```bash
npm install @vercel/speed-insights
```

Add to `App.jsx`:
```javascript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <SpeedInsights />
      {/* Your app */}
    </>
  );
}
```

---

## Troubleshooting

### Issue: API Routes Not Working
**Solution:**
- Ensure `vercel.json` is in the root directory
- Check environment variables are set correctly
- Verify MongoDB connection string is correct

### Issue: Build Fails
**Solution:**
- Run `npm run build` locally to see errors
- Check all imports are correct
- Ensure all dependencies are in `package.json`

### Issue: MongoDB Connection Error
**Solution:**
- Verify MongoDB URI is correct
- Check IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions
- Check database name in connection string

### Issue: 404 on Page Refresh
**Solution:**
- Ensure `vercel.json` has correct routing configuration
- Check that SPA fallback is configured

---

## Maintenance

### Update Code
```bash
git add .
git commit -m "Update: description"
git push origin main
```

Vercel will automatically redeploy.

### Monitor Registrations
Check MongoDB Atlas → Collections → registrations

### Backup Database
1. Go to MongoDB Atlas
2. Click "..." on your cluster
3. Select "Backup"
4. Configure backup schedule

---

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] MongoDB connection string is in environment variables
- [ ] Database user has minimal required permissions
- [ ] CORS is properly configured
- [ ] Input validation is working
- [ ] Rate limiting considered (for production)

---

## Performance Optimization

### Enable Compression
Vercel automatically enables gzip compression.

### Image Optimization
Use Vercel's Image Optimization:
```javascript
import Image from 'next/image'
```

### Caching
Vercel automatically caches static assets.

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

## 🎉 Deployment Complete!

Your webinar platform is now live and ready to accept registrations!

**Next Steps:**
1. Share the registration link
2. Monitor registrations in MongoDB
3. Send webinar details to registered users
4. Prepare for the webinar on Feb 8, 2026

---

**Need help?** Check the troubleshooting section or contact support.
