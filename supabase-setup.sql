-- ============================================
-- Webinar Registration System - Database Setup
-- Table: participants (User Provided Schema)
-- Policy: allow_insert_webinar_form
-- ============================================

-- NOTE: The table 'participants' ALREADY EXISTS with this schema:
-- create table public.participants (
--   id uuid not null default gen_random_uuid (),
--   name text not null,
--   email text null,
--   created_at timestamp with time zone null,
--   whatsapp text null default ''::text,
--   experience text null,
--   college text null,
--   current_year text null,
--   constraint participants_pkey primary key (id)
-- ) TABLESPACE pg_default;

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "allow_insert_webinar_form" ON public.participants;
DROP POLICY IF EXISTS "Allow public reads" ON public.participants;

-- Create policy to allow public inserts (for webinar registration form)
CREATE POLICY "allow_insert_webinar_form" ON public.participants
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create policy to allow public reads (for seat count)
CREATE POLICY "Allow public reads" ON public.participants
    FOR SELECT TO anon
    USING (true);

-- Verify table connection
SELECT 
    'Supabase connection successful!' as message,
    COUNT(*) as current_registrations,
    100 - COUNT(*) as available_seats
FROM public.participants;
