# Quick Setup Guide - Admin Panel

## 🚀 Quick Start (5 Minutes)

### Step 1: Database Setup
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase_migrations.sql`
4. Click "Run"
5. Wait for "Success" message

### Step 2: Storage Setup
1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it: `certificates`
4. Set to **Public**
5. Click **Create**

### Step 3: Access Admin Panel
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to: `http://localhost:5173/admin-panel`
3. Enter password: `mani02112007`

### Step 4: Create Your First Webinar
1. Click **"Webinars"** tab
2. Click **"Add Webinar"** button
3. Fill in:
   - Program Name: "My First Webinar"
   - Program Date: (choose a date)
   - Description: "Test webinar"
   - Max Participants: 100
   - ✅ Registration Open
4. Click **"Save Webinar"**

### Step 5: Create a Certificate Template
1. Click **"Certificate Templates"** tab
2. Click **"Add Template"** button
3. Fill in:
   - Template Name: "Default Certificate"
   - Template Type: Participation
   - Upload a logo (optional)
   - Choose colors (or use defaults)
   - ✅ Set as Active Template
4. Click **"Save Template"**
5. Click **"Preview"** to see your certificate

### Step 6: Test the System
1. Go to `/register` page
2. Register as a test participant
3. Go to `/attendance` page
4. Mark attendance
5. Return to Admin Panel → Records
6. Select your webinar
7. Click "Send Certificate" for the attendee

## ✅ You're Done!

Your admin panel is now fully set up and ready to use.

## 📋 Checklist

- [ ] Database tables created
- [ ] Storage bucket created
- [ ] Admin panel accessible
- [ ] First webinar created
- [ ] Certificate template created
- [ ] Test registration completed
- [ ] Test certificate sent

## 🎯 Next Steps

1. **Customize Your Certificate Template**
   - Upload your organization's logo
   - Choose brand colors
   - Preview with different settings

2. **Create Real Webinars**
   - Plan your webinar schedule
   - Set appropriate participant limits
   - Write engaging descriptions

3. **Configure Email Templates**
   - Customize EmailJS templates
   - Add your branding
   - Test email delivery

4. **Explore Features**
   - View dashboard statistics
   - Check registration records
   - Review attendance data
   - Manage certificate issuance

## 🔧 Common Issues

### "Can't connect to database"
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is active

### "Storage upload failed"
- Ensure `certificates` bucket exists
- Check bucket is set to Public
- Verify file size is under 5MB

### "Email not sending"
- Verify EmailJS credentials in `.env`
- Check EmailJS template is configured
- Test with a valid email address

## 📚 Full Documentation

For detailed information, see `ADMIN_PANEL_DOCUMENTATION.md`

## 🎨 Features Overview

### Dashboard
- Real-time statistics
- Quick action buttons
- System overview

### Webinar Management
- Create/Edit/Delete webinars
- Open/Close registration
- Track participant limits

### Certificate Templates
- Custom designs
- Logo upload
- Color customization
- Live preview

### Records Management
- View registrations
- Track attendance
- Issue certificates
- Historical data

## 🔐 Security Note

**Important**: Change the default admin password!

Edit `AdminPanelPage.jsx` line 44:
```javascript
if (password === 'YOUR_NEW_PASSWORD') {
```

## 💡 Pro Tips

1. **Create templates before webinars** - Have your certificate design ready
2. **Test with dummy data** - Register and attend as a test user first
3. **Check emails** - Verify certificate emails are being delivered
4. **Monitor stats** - Use dashboard to track your webinar success
5. **Export data regularly** - Keep backups of your records

## 🎉 Ready to Launch!

Your admin panel is production-ready. Start creating amazing webinars and issuing beautiful certificates!

---

**Need Help?** Check the full documentation or review the troubleshooting section.
