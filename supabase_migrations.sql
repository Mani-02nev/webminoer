-- Migration for Admin Panel Features
-- Run this SQL in your Supabase SQL Editor

-- 1. Create webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id BIGSERIAL PRIMARY KEY,
  program_name TEXT NOT NULL,
  program_date DATE NOT NULL,
  description TEXT,
  registration_open BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create certificate_templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id BIGSERIAL PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('participation', 'completion', 'achievement')),
  is_active BOOLEAN DEFAULT true,
  logo_url TEXT,
  background_color TEXT DEFAULT '#1a1a2e',
  primary_color TEXT DEFAULT '#ec4899',
  secondary_color TEXT DEFAULT '#8b5cf6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add webinar_id to existing tables (if not already present)
ALTER TABLE participants ADD COLUMN IF NOT EXISTS webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE;

-- 4. Create storage bucket for certificate logos (if not exists)
-- Note: This needs to be done via Supabase Dashboard -> Storage
-- Create a bucket named 'certificates' with public access

-- 5. Enable Row Level Security (RLS)
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for public read access
CREATE POLICY "Allow public read access on webinars"
  ON webinars FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on certificate_templates"
  ON certificate_templates FOR SELECT
  USING (true);

-- 7. Create policies for admin write access (you can customize this based on your auth setup)
CREATE POLICY "Allow all operations on webinars"
  ON webinars FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on certificate_templates"
  ON certificate_templates FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create triggers for updated_at
CREATE TRIGGER update_webinars_updated_at
  BEFORE UPDATE ON webinars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificate_templates_updated_at
  BEFORE UPDATE ON certificate_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Insert sample webinar (optional)
INSERT INTO webinars (program_name, program_date, description, registration_open, max_participants)
VALUES (
  'React Roadmap to Students – Webinar',
  '2026-02-15',
  'A comprehensive webinar covering React fundamentals and advanced concepts for students',
  true,
  100
);

-- 11. Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  employment_status TEXT NOT NULL CHECK (employment_status IN ('student', 'working')),
  college TEXT,
  department TEXT,
  current_year TEXT,
  company_name TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Enable RLS on community_members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- 13. Create policies for community_members
CREATE POLICY "Allow public read access on community_members"
  ON community_members FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on community_members"
  ON community_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all operations on community_members for admin"
  ON community_members FOR ALL
  USING (true)
  WITH CHECK (true);

-- 14. Add webinar_type to webinars table
ALTER TABLE webinars ADD COLUMN IF NOT EXISTS webinar_type TEXT DEFAULT 'webinar' CHECK (webinar_type IN ('webinar', 'masterclass'));

-- 15. Add certificate_type to certificates table
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certificate_type TEXT DEFAULT 'participation' CHECK (certificate_type IN ('participation', 'completion'));

-- 16. Insert default certificate templates
INSERT INTO certificate_templates (template_name, template_type, is_active, background_color, primary_color, secondary_color)
VALUES 
  ('Participation Certificate - Webinar', 'participation', true, '#1a1a2e', '#fbbf24', '#f59e0b'),
  ('Completion Certificate - Master Class', 'completion', false, '#1e1b4b', '#22d3ee', '#8b5cf6')
ON CONFLICT DO NOTHING;

