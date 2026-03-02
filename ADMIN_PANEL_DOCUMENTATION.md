# Admin Panel Documentation

## Overview
The Admin Panel is a comprehensive control center for managing webinars, certificate templates, registrations, and certificates. It provides a complete solution for organizing online events and issuing certificates to participants.

## Access
- **URL**: `/admin-panel`
- **Password**: `mani02112007`

## Features

### 1. Dashboard
The dashboard provides an overview of your entire system with real-time statistics:

- **Total Webinars**: Count of all webinars created
- **Active Webinars**: Webinars with open registration
- **Total Registrations**: All participant registrations
- **Total Attendances**: Participants who attended
- **Certificates Sent**: Total certificates issued

**Quick Actions**:
- Create new webinar
- Upload certificate template
- View records

### 2. Webinar Management

#### Creating a Webinar
1. Click "Add Webinar" button
2. Fill in the form:
   - **Program Name**: Name of your webinar (e.g., "React Roadmap Webinar")
   - **Program Date**: Date when the webinar will be held
   - **Description**: Brief description of the webinar
   - **Max Participants**: Maximum number of participants allowed
   - **Registration Open**: Toggle to open/close registration
3. Click "Save Webinar"

#### Managing Webinars
- **Open/Close Registration**: Click the lock icon to toggle registration status
- **Edit Webinar**: Click the edit icon to modify webinar details
- **Delete Webinar**: Click the trash icon to remove a webinar (this will also delete all associated records)

#### Webinar Status
- **Green Badge (Open)**: Registration is currently open
- **Red Badge (Closed)**: Registration is closed

### 3. Certificate Template Management

#### Creating a Template
1. Click "Add Template" button
2. Fill in the form:
   - **Template Name**: Descriptive name for the template
   - **Template Type**: Choose from:
     - Participation
     - Completion
     - Achievement
   - **Logo/Course Image**: Upload an image (logo or course-related image)
   - **Background Color**: Choose the certificate background color
   - **Primary Color**: Main accent color for headings
   - **Secondary Color**: Secondary accent color
   - **Set as Active**: Toggle to activate/deactivate template
3. Click "Save Template"

#### Template Features
- **Preview**: Click "Preview" to see how the certificate looks with placeholder text (XXXX)
- **Activate/Deactivate**: Control which templates are available for use
- **Color Customization**: Full control over certificate colors
- **Logo Upload**: Upload custom logos or course images

#### Certificate Preview
The preview shows:
- Certificate layout with your chosen colors
- Logo/image placement
- "XXXX" placeholders for participant name and course name
- Template type (Participation/Completion/Achievement)

### 4. Records Management

#### Selecting a Webinar
1. Choose a webinar from the dropdown menu
2. View all associated records for that webinar

#### Active Records Tab
Shows current/recent records:

**Registrations**:
- List of all registered participants
- Displays: Name, Email, College, Year
- Real-time count of registrations

**Attendances**:
- Participants who attended the webinar
- Displays: Name, Email, Rating, Feedback
- **Send Certificate** button for each attendee
- Star ratings visualization

**Certificates Issued**:
- All certificates sent for this webinar
- Certificate ID for verification
- Quick actions:
  - View certificate
  - Resend certificate email

#### History Tab
Archive of past webinar records for reference and reporting.

### 5. Certificate Generation & Sending

#### Automatic Certificate Generation
When you click "Send Certificate" for an attendee:
1. System generates a unique certificate ID
2. Creates certificate record in database
3. Generates PDF certificate
4. Sends email to participant with download link
5. Updates certificate count in dashboard

#### Certificate ID Format
`CERT-[timestamp]-[random]`

Example: `CERT-1708012345678-789`

### 6. Email Integration

The system automatically sends emails for:
- Registration confirmation
- Certificate delivery with download link

Emails are sent via EmailJS integration.

## Database Structure

### Webinars Table
```sql
- id: Unique identifier
- program_name: Name of the webinar
- program_date: Date of the webinar
- description: Webinar description
- registration_open: Boolean (open/closed)
- max_participants: Maximum allowed participants
- created_at: Creation timestamp
- updated_at: Last update timestamp
```

### Certificate Templates Table
```sql
- id: Unique identifier
- template_name: Template name
- template_type: Type (participation/completion/achievement)
- is_active: Boolean (active/inactive)
- logo_url: URL to uploaded logo
- background_color: Hex color code
- primary_color: Hex color code
- secondary_color: Hex color code
- created_at: Creation timestamp
- updated_at: Last update timestamp
```

### Related Tables
- **participants**: Linked via webinar_id
- **attendance**: Linked via webinar_id
- **certificates**: Linked via webinar_id

## Setup Instructions

### 1. Database Setup
Run the SQL migration file in your Supabase SQL Editor:
```bash
# File: supabase_migrations.sql
```

This will create:
- `webinars` table
- `certificate_templates` table
- Add `webinar_id` foreign keys to existing tables
- Set up Row Level Security (RLS)
- Create necessary triggers

### 2. Storage Setup
In Supabase Dashboard:
1. Go to Storage
2. Create a new bucket named `certificates`
3. Set it to **Public** access
4. Configure CORS if needed

### 3. Environment Variables
Ensure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Workflow Example

### Complete Webinar Workflow

1. **Create Webinar**
   - Go to Webinars section
   - Add new webinar with details
   - Open registration

2. **Create Certificate Template**
   - Go to Templates section
   - Upload logo
   - Customize colors
   - Preview and activate

3. **Participants Register**
   - Users register via `/register` page
   - Data stored in participants table
   - Linked to webinar via webinar_id

4. **Conduct Webinar**
   - Hold your webinar session
   - Participants mark attendance via `/attendance` page

5. **Issue Certificates**
   - Go to Records section
   - Select the webinar
   - View attendances
   - Click "Send Certificate" for each attendee
   - Or use bulk send (if implemented)

6. **View History**
   - Switch to History tab
   - Review past webinars
   - Check certificate issuance records

## Tips & Best Practices

### Webinar Management
- Create webinars well in advance
- Close registration before the event starts
- Set realistic max participant limits
- Use clear, descriptive program names

### Certificate Templates
- Keep only 1-2 templates active at a time
- Use high-quality logos (PNG with transparent background recommended)
- Test preview before activating
- Choose colors that provide good contrast
- Use consistent branding across templates

### Records Management
- Regularly check registration numbers
- Send certificates within 24-48 hours after the webinar
- Keep history for reporting and analytics
- Export data periodically for backup

### Security
- Change the default admin password
- Don't share admin credentials
- Regularly review access logs
- Keep Supabase RLS policies updated

## Troubleshooting

### Issue: Can't upload logo
**Solution**: 
- Check Supabase storage bucket exists
- Verify bucket is set to public
- Check file size (max 5MB recommended)
- Ensure file is an image format (PNG, JPG, SVG)

### Issue: Certificates not sending
**Solution**:
- Verify EmailJS credentials in `.env`
- Check email template is configured
- Ensure participant has valid email
- Check browser console for errors

### Issue: Webinar not showing in dropdown
**Solution**:
- Refresh the page
- Check if webinar was saved successfully
- Verify database connection
- Check browser console for errors

### Issue: Stats not updating
**Solution**:
- Refresh the dashboard
- Check database queries in browser console
- Verify Supabase connection
- Clear browser cache

## API Endpoints Used

### Supabase Queries
- `supabase.from('webinars').select('*')`
- `supabase.from('certificate_templates').select('*')`
- `supabase.from('participants').select('*').eq('webinar_id', id)`
- `supabase.from('attendance').select('*').eq('webinar_id', id)`
- `supabase.from('certificates').select('*').eq('webinar_id', id)`

### Storage
- `supabase.storage.from('certificates').upload(path, file)`
- `supabase.storage.from('certificates').getPublicUrl(path)`

## Future Enhancements

Potential features to add:
- Bulk certificate sending
- Certificate template editor (WYSIWYG)
- Analytics dashboard with charts
- Export records to CSV/Excel
- Email template customization
- Automated reminder emails
- QR code generation for certificates
- Multi-language support
- Custom fields for certificates
- Webinar recording upload/management

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check Supabase logs
4. Verify environment variables
5. Test with sample data

## Version History

- **v1.0.0** (2026-02-16): Initial release
  - Dashboard with statistics
  - Webinar management
  - Certificate template management
  - Records viewing (Active/History)
  - Certificate generation and sending
