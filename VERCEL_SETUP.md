# Vercel Deployment Guide

Your project is fully configured for Vercel. However, since we do not commit `.env` files for security, you **MUST** add these variables manually in the Vercel Dashboard for the app to work.

## 1. Deploy Your Project
1. Push your code to GitHub.
2. Import the repository in Vercel.
3. The build settings are already auto-detected.

## 2. Add Environment Variables (IMPORTANT!)
Go to **Settings** > **Environment Variables** in your Vercel Project and add the following:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://iihurfyxvqiukwndsnpf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_stN460YWs4b-jbzTpvVUGQ_KzyQPBo2` |
| `VITE_EMAILJS_SERVICE_ID` | `service_j0zb9h4` |
| `VITE_EMAILJS_TEMPLATE_ID_REG` | `template_bdalbtp` |
| `VITE_EMAILJS_TEMPLATE_ID_CERT` | `template_6s8souj` |
| `VITE_EMAILJS_PUBLIC_KEY` | `ZHOIXPoYaVJw-zHdI` |

**If you skip this step, the website will load but Registration and Admin Login will fail.**

## 3. Redeploy
After adding the variables, go to **Deployments** and click **Redeploy** on the latest commit to ensure the new variables are picked up.
