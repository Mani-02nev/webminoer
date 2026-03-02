# Certificate Sending Guide

## How to Manually Send Certificates from the Attendance Page

### Access the Admin Panel

1. Navigate to the **Admin Generator Page** (usually `/admin` or similar route)
2. Enter the admin password: `mani02112007`

### Navigate to Attendance Tab

Once logged in, you'll see three tabs:
- **Registered Users** - All people who registered for the webinar
- **Attendance** - People who marked their attendance (this is what you need!)
- **Manual** - Manually create a certificate for anyone

Click on the **Attendance** tab.

### Send Certificates

You have two options:

#### Option 1: Send to Individual Attendees
- Each attendee in the attendance list has a **"Send Cert"** button
- Click this button to generate and email the certificate to that specific person
- The certificate will be:
  - Generated with their name and email
  - Saved to the database
  - Emailed to them automatically

#### Option 2: Bulk Send to ALL Attendees
- At the top of the attendance list, there's a **"Send Certificates to ALL"** button
- Click this to send certificates to everyone who marked attendance
- You'll get a confirmation dialog before it starts
- A progress bar will show you:
  - How many certificates have been processed
  - How many were successful
  - How many failed

### What Happens When You Send a Certificate?

1. **Certificate Generation**: A unique certificate ID is created (format: `TT-REACT-YYYY-XXXX`)
2. **Database Storage**: The certificate details are saved to the `certificates` table
3. **PDF Creation**: A PDF certificate is generated with the attendee's name
4. **Email Delivery**: The certificate is automatically emailed to the attendee via EmailJS
5. **Success Feedback**: You'll see a green success message with the certificate details

### Important Notes

- **Duplicate Prevention**: If a certificate already exists for an email, it won't create a duplicate
- **Email Status**: You can see if the email was sent successfully, failed, or skipped
- **Manual Resend**: If an email fails, you can manually resend it from the success message
- **Attendance Data**: The attendance list shows:
  - Name
  - Email
  - Rating (star rating they gave)
  - Feedback (their comments about the webinar)

### Troubleshooting

**If certificates aren't sending:**
1. Check your `.env` file has the correct EmailJS credentials:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
2. Verify the Supabase connection is working
3. Check the browser console for any error messages

**If bulk sending fails:**
- The system processes one certificate at a time with a 500ms delay
- If some fail, you can manually resend to those specific attendees
- Check the final summary to see success/failure counts
