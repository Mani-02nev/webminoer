-- =====================================================
-- COMPLETE MIGRATION - Correct Order
-- =====================================================
-- This script creates everything in the right order
-- Safe to run on a fresh or existing database
-- =====================================================

-- Step 1: Create webinars table FIRST (no dependencies)
CREATE TABLE IF NOT EXISTS webinars (
  id BIGSERIAL PRIMARY KEY,
  program_name TEXT NOT NULL,
  program_date DATE NOT NULL,
  description TEXT,
  webinar_type TEXT DEFAULT 'webinar' CHECK (webinar_type IN ('webinar', 'masterclass')),
  registration_open BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create persons table (no dependencies)
CREATE TABLE IF NOT EXISTS persons (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create participants table (depends on webinars and persons)
CREATE TABLE IF NOT EXISTS participants (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT REFERENCES persons(id) ON DELETE CASCADE,
  webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  experience TEXT,
  current_year TEXT,
  college TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(person_id, webinar_id)
);

-- Step 4: Add missing columns to participants if they don't exist
DO $$ 
BEGIN
  -- Add person_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'person_id'
  ) THEN
    ALTER TABLE participants ADD COLUMN person_id BIGINT REFERENCES persons(id) ON DELETE CASCADE;
  END IF;
  
  -- Add webinar_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'webinar_id'
  ) THEN
    ALTER TABLE participants ADD COLUMN webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE;
  END IF;
  
  -- Add experience if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'experience'
  ) THEN
    ALTER TABLE participants ADD COLUMN experience TEXT;
  END IF;
  
  -- Add current_year if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'current_year'
  ) THEN
    ALTER TABLE participants ADD COLUMN current_year TEXT;
  END IF;
  
  -- Add college if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'college'
  ) THEN
    ALTER TABLE participants ADD COLUMN college TEXT;
  END IF;
END $$;

-- Step 5: Create attendance table (depends on webinars, persons, participants)
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT REFERENCES persons(id) ON DELETE CASCADE,
  webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE,
  participant_id BIGINT REFERENCES participants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(person_id, webinar_id)
);

-- Step 6: Create certificates table (depends on webinars, persons, attendance)
CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT REFERENCES persons(id) ON DELETE CASCADE,
  webinar_id BIGINT REFERENCES webinars(id) ON DELETE CASCADE,
  attendance_id BIGINT REFERENCES attendance(id) ON DELETE CASCADE,
  certificate_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  certificate_type TEXT DEFAULT 'participation' CHECK (certificate_type IN ('participation', 'completion')),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create community_members table (depends on persons)
CREATE TABLE IF NOT EXISTS community_members (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT REFERENCES persons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  employment_status TEXT NOT NULL CHECK (employment_status IN ('student', 'working')),
  college TEXT,
  department TEXT,
  current_year TEXT,
  company_name TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(person_id)
);

-- Step 8: Create certificate_templates table (no dependencies)
CREATE TABLE IF NOT EXISTS certificate_templates (
  id BIGSERIAL PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('participation', 'completion', 'achievement')),
  webinar_type TEXT CHECK (webinar_type IN ('webinar', 'masterclass')),
  is_active BOOLEAN DEFAULT true,
  logo_url TEXT,
  background_color TEXT DEFAULT '#1a1a2e',
  primary_color TEXT DEFAULT '#ec4899',
  secondary_color TEXT DEFAULT '#8b5cf6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create admin_users table (no dependencies)
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Create admin_activity_logs table (depends on admin_users)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id BIGINT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 11: Enable RLS on all tables
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Step 12: Create policies (drop existing first to avoid conflicts)
DO $$ 
BEGIN
  -- Persons policies
  DROP POLICY IF EXISTS "Allow public read on persons" ON persons;
  DROP POLICY IF EXISTS "Allow insert on persons" ON persons;
  DROP POLICY IF EXISTS "Allow update on persons" ON persons;
  
  CREATE POLICY "Allow public read on persons" ON persons FOR SELECT USING (true);
  CREATE POLICY "Allow insert on persons" ON persons FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow update on persons" ON persons FOR UPDATE USING (true);
  
  -- Webinars policies
  DROP POLICY IF EXISTS "Allow public read on webinars" ON webinars;
  DROP POLICY IF EXISTS "Allow all operations on webinars" ON webinars;
  
  CREATE POLICY "Allow public read on webinars" ON webinars FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on webinars" ON webinars FOR ALL USING (true) WITH CHECK (true);
  
  -- Participants policies
  DROP POLICY IF EXISTS "Allow public read on participants" ON participants;
  DROP POLICY IF EXISTS "Allow public insert on participants" ON participants;
  DROP POLICY IF EXISTS "Allow all operations on participants" ON participants;
  
  CREATE POLICY "Allow public read on participants" ON participants FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on participants" ON participants FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true) WITH CHECK (true);
  
  -- Attendance policies
  DROP POLICY IF EXISTS "Allow public read on attendance" ON attendance;
  DROP POLICY IF EXISTS "Allow all operations on attendance" ON attendance;
  
  CREATE POLICY "Allow public read on attendance" ON attendance FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
  
  -- Certificates policies
  DROP POLICY IF EXISTS "Allow public read on certificates" ON certificates;
  DROP POLICY IF EXISTS "Allow all operations on certificates" ON certificates;
  
  CREATE POLICY "Allow public read on certificates" ON certificates FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);
  
  -- Community members policies
  DROP POLICY IF EXISTS "Allow public read on community_members" ON community_members;
  DROP POLICY IF EXISTS "Allow public insert on community_members" ON community_members;
  DROP POLICY IF EXISTS "Allow all operations on community_members" ON community_members;
  
  CREATE POLICY "Allow public read on community_members" ON community_members FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on community_members" ON community_members FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow all operations on community_members" ON community_members FOR ALL USING (true) WITH CHECK (true);
  
  -- Certificate templates policies
  DROP POLICY IF EXISTS "Allow public read on certificate_templates" ON certificate_templates;
  DROP POLICY IF EXISTS "Allow all operations on certificate_templates" ON certificate_templates;
  
  CREATE POLICY "Allow public read on certificate_templates" ON certificate_templates FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on certificate_templates" ON certificate_templates FOR ALL USING (true) WITH CHECK (true);
  
  -- Admin users policies
  DROP POLICY IF EXISTS "Allow admin read on admin_users" ON admin_users;
  DROP POLICY IF EXISTS "Allow all operations on admin_users" ON admin_users;
  
  CREATE POLICY "Allow admin read on admin_users" ON admin_users FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);
  
  -- Admin activity logs policies
  DROP POLICY IF EXISTS "Allow admin read on admin_activity_logs" ON admin_activity_logs;
  DROP POLICY IF EXISTS "Allow admin insert on admin_activity_logs" ON admin_activity_logs;
  
  CREATE POLICY "Allow admin read on admin_activity_logs" ON admin_activity_logs FOR SELECT USING (true);
  CREATE POLICY "Allow admin insert on admin_activity_logs" ON admin_activity_logs FOR INSERT WITH CHECK (true);
END $$;

-- Step 13: Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_persons_updated_at ON persons;
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON persons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webinars_updated_at ON webinars;
CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON webinars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificate_templates_updated_at ON certificate_templates;
CREATE TRIGGER update_certificate_templates_updated_at BEFORE UPDATE ON certificate_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 14: Create helper functions
CREATE OR REPLACE FUNCTION get_or_create_person(
  p_email TEXT,
  p_name TEXT,
  p_whatsapp TEXT DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
  v_person_id BIGINT;
BEGIN
  SELECT id INTO v_person_id FROM persons WHERE email = p_email;
  
  IF v_person_id IS NULL THEN
    INSERT INTO persons (email, name, whatsapp)
    VALUES (p_email, p_name, p_whatsapp)
    RETURNING id INTO v_person_id;
  ELSE
    UPDATE persons 
    SET name = p_name, 
        whatsapp = COALESCE(p_whatsapp, whatsapp),
        updated_at = NOW()
    WHERE id = v_person_id;
  END IF;
  
  RETURN v_person_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_person_stats(p_person_id BIGINT)
RETURNS TABLE (
  total_registrations BIGINT,
  total_attendances BIGINT,
  total_certificates BIGINT,
  is_community_member BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM participants WHERE person_id = p_person_id),
    (SELECT COUNT(*) FROM attendance WHERE person_id = p_person_id),
    (SELECT COUNT(*) FROM certificates WHERE person_id = p_person_id),
    EXISTS(SELECT 1 FROM community_members WHERE person_id = p_person_id);
END;
$$ LANGUAGE plpgsql;

-- Step 15: Create views
CREATE OR REPLACE VIEW webinar_summary AS
SELECT 
  w.id,
  w.program_name,
  w.program_date,
  w.webinar_type,
  w.registration_open,
  w.max_participants,
  COUNT(DISTINCT p.id) as total_registrations,
  COUNT(DISTINCT a.id) as total_attendances,
  COUNT(DISTINCT c.id) as total_certificates,
  w.created_at
FROM webinars w
LEFT JOIN participants p ON w.id = p.webinar_id
LEFT JOIN attendance a ON w.id = a.webinar_id
LEFT JOIN certificates c ON w.id = c.webinar_id
GROUP BY w.id
ORDER BY w.program_date DESC;

CREATE OR REPLACE VIEW person_complete_profile AS
SELECT 
  p.id,
  p.email,
  p.name,
  p.whatsapp,
  COUNT(DISTINCT part.id) as total_registrations,
  COUNT(DISTINCT att.id) as total_attendances,
  COUNT(DISTINCT cert.id) as total_certificates,
  CASE WHEN cm.id IS NOT NULL THEN true ELSE false END as is_community_member,
  p.created_at
FROM persons p
LEFT JOIN participants part ON p.id = part.person_id
LEFT JOIN attendance att ON p.id = att.person_id
LEFT JOIN certificates cert ON p.id = cert.person_id
LEFT JOIN community_members cm ON p.id = cm.person_id
GROUP BY p.id, cm.id
ORDER BY p.created_at DESC;

-- Step 16: Create indexes
CREATE INDEX IF NOT EXISTS idx_persons_email ON persons(email);
CREATE INDEX IF NOT EXISTS idx_participants_person_id ON participants(person_id);
CREATE INDEX IF NOT EXISTS idx_participants_webinar_id ON participants(webinar_id);
CREATE INDEX IF NOT EXISTS idx_attendance_person_id ON attendance(person_id);
CREATE INDEX IF NOT EXISTS idx_attendance_webinar_id ON attendance(webinar_id);
CREATE INDEX IF NOT EXISTS idx_certificates_person_id ON certificates(person_id);
CREATE INDEX IF NOT EXISTS idx_certificates_webinar_id ON certificates(webinar_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_community_members_person_id ON community_members(person_id);
CREATE INDEX IF NOT EXISTS idx_community_members_email ON community_members(email);

-- Step 17: Migrate existing data (only if participants table has data)
DO $$ 
BEGIN
  -- Check if participants table has data
  IF EXISTS (SELECT 1 FROM participants LIMIT 1) THEN
    -- Migrate to persons table
    INSERT INTO persons (email, name, whatsapp)
    SELECT DISTINCT email, name, whatsapp 
    FROM participants
    WHERE email IS NOT NULL
    ON CONFLICT (email) DO UPDATE 
    SET name = EXCLUDED.name,
        whatsapp = COALESCE(EXCLUDED.whatsapp, persons.whatsapp);
    
    -- Update participants with person_id
    UPDATE participants p
    SET person_id = (SELECT id FROM persons WHERE email = p.email)
    WHERE person_id IS NULL AND email IS NOT NULL;
  END IF;
END $$;

-- Step 18: Insert sample data (optional)
INSERT INTO webinars (program_name, program_date, description, webinar_type, registration_open, max_participants)
VALUES (
  'React Roadmap to Students – Webinar',
  '2026-02-15',
  'A comprehensive webinar covering React fundamentals and advanced concepts for students',
  'webinar',
  false,
  100
)
ON CONFLICT DO NOTHING;

INSERT INTO certificate_templates (template_name, template_type, webinar_type, is_active, background_color, primary_color, secondary_color)
VALUES 
  ('Participation Certificate - Webinar', 'participation', 'webinar', true, '#1a1a2e', '#fbbf24', '#f59e0b'),
  ('Completion Certificate - Master Class', 'completion', 'masterclass', false, '#1e1b4b', '#22d3ee', '#8b5cf6')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables exist
SELECT 
  'persons' as table_name, COUNT(*) as row_count FROM persons
UNION ALL
SELECT 'webinars', COUNT(*) FROM webinars
UNION ALL
SELECT 'participants', COUNT(*) FROM participants
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance
UNION ALL
SELECT 'certificates', COUNT(*) FROM certificates
UNION ALL
SELECT 'community_members', COUNT(*) FROM community_members
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'admin_activity_logs', COUNT(*) FROM admin_activity_logs;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- All tables, functions, views, and policies created
-- Data migrated from participants to persons
-- Ready to use!
-- =====================================================
