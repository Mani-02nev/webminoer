# ⚡️ Supabase Edge Function & Resend Setup Guide

We have switched from EmailJS to **Supabase Edge Functions + Resend** for better reliability and deliverability.

## ✅ Prerequisites

1.  **Supabase CLI** installed on your computer.
    *   If not, install it: `brew install supabase/tap/supabase` (Mac)
2.  **Resend Account** (https://resend.com)
    *   Sign up (works with GitHub).
    *   It has a generous free tier (3000 emails/mo).

---

## 🚀 Step 1: Get Resend API Key

1.  Log in to [Resend Dashboard](https://resend.com/api-keys).
2.  Click **Create API Key**.
3.  Name it `webinar-app`.
4.  Permission: **Full Access** (default).
5.  Copy the key (starts with `re_...`).

## 🔑 Step 2: Set Secret in Supabase

You need to store this key safely in your Supabase project.

1.  Open your terminal in the project folder.
2.  Login to Supabase CLI (if not already):
    ```bash
    supabase login
    ```
3.  Link your project (if not linked):
    *   Find your project ID (from dashboard url: `https://supabase.com/dashboard/project/your_project_id`)
    *   Run: `supabase link --project-ref your_project_id`
4.  Set the secret:
    ```bash
    supabase secrets set RESEND_API_KEY=re_123456789your_key_here
    ```

---

## ☁️ Step 3: Deploy the Function

We have already created the function code in `supabase/functions/resend-email/index.ts`. Now, deploy it to the cloud.

Run this command in your terminal:

```bash
supabase functions deploy resend-email
```

*   If it asks "Do you want to run Deno?", say **Yes**.
*   It should say `Deployed Function resend-email` when done.

---

## 🧪 Step 4: Verify & Test

1.  Start your app: `npm run dev`
2.  Go to the Registration Page.
3.  Register with a **real email address**.
4.  Check your inbox!

**(Note on Resend Free Tier)**:
If you have NOT verified your domain on Resend, emails will be sent from `onboarding@resend.dev` and **ONLY to the email address you used to sign up for Resend**.
*   To send to *anyone*, you must verify a domain (like `timestech.com`) in Resend Dashboard -> Domains.

---

## 🛠 Troubleshooting

### 1. "Functions not available" or 500 Error
*   Start the function execution log stream:
    ```bash
    supabase functions logs -f resend-email --tail
    ```
*   Then try to register again. The logs will show exactly why it failed.

### 2. "Missing RESEND_API_KEY"
*   You forgot Step 2. Run `supabase secrets set RESEND_API_KEY=...` again.

### 3. "CORS Error"
*   This is usually handled by the function code (`corsHeaders`), but if the function crashes *before* returning headers, the browser interprets it as a CORS error. Check the logs (Step 1).
