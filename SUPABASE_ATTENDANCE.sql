-- Create ATTENDANCE table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT,
    rating INTEGER,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so users can mark attendance without login)
CREATE POLICY "Allow public inserts attendance" ON attendance
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow admins (or anyone for now to keep it simple as per previous setup) to read
CREATE POLICY "Allow public reads attendance" ON attendance
    FOR SELECT TO anon
    USING (true);
