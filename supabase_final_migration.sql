-- =====================================================
-- FINAL MIGRATION - Handles All Cases
-- =====================================================
-- This script works with ANY existing database state
-- Safe to run multiple times
-- =====================================================

-- Step 1: Create webinars table FIRST
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

-- Step 2: Create persons table
CREATE TABLE IF NOT EXISTS persons (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT,
  webinar_id BIGINT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  experience TEXT,
  current_year TEXT,
  college TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Add foreign keys to participants AFTER tables exist
DO $$ 
BEGIN
  -- Add person_id column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'person_id'
  ) THEN
    ALTER TABLE participants ADD COLUMN person_id BIGINT;
  END IF;
  
  -- Add webinar_id column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'participants' AND column_name = 'webinar_id'
  ) THEN
    ALTER TABLE participants ADD COLUMN webinar_id BIGINT;
  END IF;
  
  -- Add foreign key constraints if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'participants_person_id_fkey'
  ) THEN
    ALTER TABLE participants ADD CONSTRAINT participants_person_id_fkey 
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'participants_webinar_id_fkey'
  ) THEN
    ALTER TABLE participants ADD CONSTRAINT participants_webinar_id_fkey 
    FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 5: Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT,
  webinar_id BIGINT,
  participant_id BIGINT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Add columns and foreign keys to attendance
DO $$ 
BEGIN
  -- Add person_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance' AND column_name = 'person_id'
  ) THEN
    ALTER TABLE attendance ADD COLUMN person_id BIGINT;
  END IF;
  
  -- Add webinar_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance' AND column_name = 'webinar_id'
  ) THEN
    ALTER TABLE attendance ADD COLUMN webinar_id BIGINT;
  END IF;
  
  -- Add participant_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance' AND column_name = 'participant_id'
  ) THEN
    ALTER TABLE attendance ADD COLUMN participant_id BIGINT;
  END IF;
  
  -- Add foreign key constraints if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'attendance_person_id_fkey'
  ) THEN
    ALTER TABLE attendance ADD CONSTRAINT attendance_person_id_fkey 
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'attendance_webinar_id_fkey'
  ) THEN
    ALTER TABLE attendance ADD CONSTRAINT attendance_webinar_id_fkey 
    FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'attendance_participant_id_fkey'
  ) THEN
    ALTER TABLE attendance ADD CONSTRAINT attendance_participant_id_fkey 
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 7: Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT,
  webinar_id BIGINT,
  attendance_id BIGINT,
  certificate_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  certificate_type TEXT DEFAULT 'participation' CHECK (certificate_type IN ('participation', 'completion')),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Add foreign keys to certificates
DO $$ 
BEGIN
  -- Add person_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certificates' AND column_name = 'person_id'
  ) THEN
    ALTER TABLE certificates ADD COLUMN person_id BIGINT;
  END IF;
  
  -- Add webinar_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certificates' AND column_name = 'webinar_id'
  ) THEN
    ALTER TABLE certificates ADD COLUMN webinar_id BIGINT;
  END IF;
  
  -- Add attendance_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'certificates' AND column_name = 'attendance_id'
  ) THEN
    ALTER TABLE certificates ADD COLUMN attendance_id BIGINT;
  END IF;
  
  -- Add foreign key constraints if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'certificates_person_id_fkey'
  ) THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_person_id_fkey 
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'certificates_webinar_id_fkey'
  ) THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_webinar_id_fkey 
    FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'certificates_attendance_id_fkey'
  ) THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_attendance_id_fkey 
    FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 9: Create community_members table
CREATE TABLE IF NOT EXISTS community_members (
  id BIGSERIAL PRIMARY KEY,
  person_id BIGINT,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Add foreign key to community_members
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_members' AND column_name = 'person_id'
  ) THEN
    ALTER TABLE community_members ADD COLUMN person_id BIGINT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'community_members_person_id_fkey'
  ) THEN
    ALTER TABLE community_members ADD CONSTRAINT community_members_person_id_fkey 
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 11: Create certificate_templates table
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

-- Step 12: Create admin_users table
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

-- Step 13: Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id BIGINT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 14: Add foreign key to admin_activity_logs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_activity_logs_admin_id_fkey'
  ) THEN
    ALTER TABLE admin_activity_logs ADD CONSTRAINT admin_activity_logs_admin_id_fkey 
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Step 15: Enable RLS
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Step 16: Create policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read on persons" ON persons;
  DROP POLICY IF EXISTS "Allow insert on persons" ON persons;
  DROP POLICY IF EXISTS "Allow update on persons" ON persons;
  DROP POLICY IF EXISTS "Allow public read on webinars" ON webinars;
  DROP POLICY IF EXISTS "Allow all operations on webinars" ON webinars;
  DROP POLICY IF EXISTS "Allow public read on participants" ON participants;
  DROP POLICY IF EXISTS "Allow public insert on participants" ON participants;
  DROP POLICY IF EXISTS "Allow all operations on participants" ON participants;
  DROP POLICY IF EXISTS "Allow public read on attendance" ON attendance;
  DROP POLICY IF EXISTS "Allow all operations on attendance" ON attendance;
  DROP POLICY IF EXISTS "Allow public read on certificates" ON certificates;
  DROP POLICY IF EXISTS "Allow all operations on certificates" ON certificates;
  DROP POLICY IF EXISTS "Allow public read on community_members" ON community_members;
  DROP POLICY IF EXISTS "Allow public insert on community_members" ON community_members;
  DROP POLICY IF EXISTS "Allow all operations on community_members" ON community_members;
  DROP POLICY IF EXISTS "Allow public read on certificate_templates" ON certificate_templates;
  DROP POLICY IF EXISTS "Allow all operations on certificate_templates" ON certificate_templates;
  DROP POLICY IF EXISTS "Allow admin read on admin_users" ON admin_users;
  DROP POLICY IF EXISTS "Allow all operations on admin_users" ON admin_users;
  DROP POLICY IF EXISTS "Allow admin read on admin_activity_logs" ON admin_activity_logs;
  DROP POLICY IF EXISTS "Allow admin insert on admin_activity_logs" ON admin_activity_logs;
  
  CREATE POLICY "Allow public read on persons" ON persons FOR SELECT USING (true);
  CREATE POLICY "Allow insert on persons" ON persons FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow update on persons" ON persons FOR UPDATE USING (true);
  CREATE POLICY "Allow public read on webinars" ON webinars FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on webinars" ON webinars FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow public read on participants" ON participants FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on participants" ON participants FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow public read on attendance" ON attendance FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow public read on certificates" ON certificates FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow public read on community_members" ON community_members FOR SELECT USING (true);
  CREATE POLICY "Allow public insert on community_members" ON community_members FOR INSERT WITH CHECK (true);
  CREATE POLICY "Allow all operations on community_members" ON community_members FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow public read on certificate_templates" ON certificate_templates FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on certificate_templates" ON certificate_templates FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow admin read on admin_users" ON admin_users FOR SELECT USING (true);
  CREATE POLICY "Allow all operations on admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);
  CREATE POLICY "Allow admin read on admin_activity_logs" ON admin_activity_logs FOR SELECT USING (true);
  CREATE POLICY "Allow admin insert on admin_activity_logs" ON admin_activity_logs FOR INSERT WITH CHECK (true);
END $$;

-- Step 17: Create triggers
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

-- Step 18: Create helper functions
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

-- Step 19: Create views (ONLY after all columns exist)
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

-- Step 20: Create indexes
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

-- Step 21: Migrate existing data
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM participants WHERE email IS NOT NULL LIMIT 1) THEN
    INSERT INTO persons (email, name, whatsapp)
    SELECT DISTINCT email, name, whatsapp 
    FROM participants
    WHERE email IS NOT NULL
    ON CONFLICT (email) DO UPDATE 
    SET name = EXCLUDED.name,
        whatsapp = COALESCE(EXCLUDED.whatsapp, persons.whatsapp);
    
    UPDATE participants p
    SET person_id = (SELECT id FROM persons WHERE email = p.email)
    WHERE person_id IS NULL AND email IS NOT NULL;
  END IF;
END $$;

-- Step 22: Insert sample data
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

INSERT INTO certificate_templates (template_name, template_type, webinar_type, is_active)
VALUES 
  ('Participation Certificate - Webinar', 'participation', 'webinar', true),
  ('Completion Certificate - Master Class', 'completion', 'masterclass', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================
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
SELECT 'community_members', COUNT(*) FROM community_members;

-- =====================================================
-- SUCCESS!
-- =====================================================
