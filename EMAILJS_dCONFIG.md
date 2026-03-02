# 📧 EmailJS Configuration Guide

Use these EXACT settings in your EmailJS Dashboard to ensure emails go to the user, not you.

## 1. Registration Template Settings

Go to **Email Templates** -> **Settings** (for your Registration Template).

| Field | Value to Enter (Copy & Paste) | Notes |
| :--- | :--- | :--- |
| **To Email** | `{{to_email}}` | **CRITICAL**: Do not put your email here. |
| **From Name** | `Tech Stack Support` | Or use `{{from_name}}` if you prefer dynamic. |
| **From Email** | (Check the box) ☑ Use Default Email Address | Ensures delivery. |
| **Reply To** | `{{reply_to}}` | Allows you to reply to the user. |
| **BCC** | (Optional) Your email | If you want a hidden copy. |

## 2. Template Content (Body)

Ensure you use these variable names in your HTML/Text design:

*   `{{name}}` -> The user's name
*   `{{date}}` -> The webinar date
*   `{{webinar_time}}` -> The webinar time

## 3. Auto-Reply

Turn **OFF** Auto-Reply for this template unless you specifically configured it. We are using the main transaction email.

## 4. Testing

1.  Save the template.
2.  Go to your website.
3.  Register with a **different** email (e.g., a friend's email or a secondary email of yours).
4.  Check if that email receives the message.
