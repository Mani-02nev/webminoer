-- Create the certificates table functionality
create table public.certificates (
  id uuid not null default gen_random_uuid (),
  certificate_id text not null,
  name text null,
  email text null,
  webinar_title text null,
  conducted_by text null,
  issued_date date null,
  is_completed boolean null,
  created_at timestamp with time zone null,
  constraint certificate_id_pkey primary key (id)
) TABLESPACE pg_default;

-- Setup RLS (Row Level Security)
alter table public.certificates enable row level security;

-- Policy to allow public read access (for verification)
create policy "Enable read access for all users"
on "public"."certificates"
as PERMISSIVE
for SELECT
to public
using ( true );

-- Policy to allow inserts (as requested by user)
create policy "allow_insert_webinar_form"
on "public"."certificates"
to public
with check (
  true
);

-- Insert Demo Data into certificates table
INSERT INTO public.certificates (
    certificate_id,
    name,
    email,
    webinar_title,
    conducted_by,
    issued_date,
    is_completed
) VALUES (
    'TT-REACT-2026-001',
    'Mani',
    'mani@example.com',
    'React Roadmap to Students – Webinar',
    'KARUPPASAMY M – Computer Engineering Student | Times Tech Pvt Ltd',
    '2026-02-15',
    true
);
