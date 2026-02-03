# EmailJS Troubleshooting Guide

If you are finding that emails are being sent to YOU (the admin) instead of the USER (the registrant), please follow these steps:

## 1. Check EmailJS Dashboard - Template Settings

The most common cause is that the **To Email** field in your EmailJS Template is hardcoded.

1.  Login to [EmailJS Dashboard](https://dashboard.emailjs.com/).
2.  Go to **Email Templates**.
3.  Select the template used for Registration (`TEMPLATE_ID_REGISTRATION`).
4.  Look at the **"To Email"** field (on the right side or top settings).
5.  **CRITICAL:** Ensure it contains the variable `{{to_email}}` (or `{{email}}`).
    *   If it shows your personal email address, **delete it** and type `{{to_email}}`.
    *   If it is empty, check the "Auto-Reply" checkbox if you are using that feature.

## 2. Check "Reply To"

I have updated the code to automatically send a `reply_to` parameter with the user's email.
In your template, you can set the **"Reply To"** field to `{{reply_to}}`.
This ensures that if you (admin) get the email, hitting "Reply" will reply to the user.

## 3. Verify Variable Names

The code now sends the following variables to your template:
*   `to_email` (Recommended for "To Email" field)
*   `email` (Alternate)
*   `user_email` (Alternate)
*   `reply_to` (For "Reply To" field)
*   `to_name`
*   `webinar_date`
*   `webinar_time`
*   `message`

Ensure your template uses these exact variable names (e.g. `{{webinar_date}}`).

## 4. Check "From Email"

Make sure the "From Email" is a valid sender identity verified in your Email Service or uses the default EmailJS service email.
