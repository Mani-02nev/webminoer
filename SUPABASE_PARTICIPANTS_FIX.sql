-- Enable RLS on participants
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon usage for Registration (Insert)
CREATE POLICY "Enable insert for public" 
ON public.participants 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow Public/Anon usage for Admin (Select)
-- Note: In a real app, we'd use authenticated roles, but for this password-protected client-side app:
CREATE POLICY "Enable select for public" 
ON public.participants 
FOR SELECT 
TO public 
USING (true);

-- Insert a Dummy Participant to verify the list works
INSERT INTO public.participants (
    name, 
    email, 
    whatsapp, 
    college, 
    current_year, 
    experience,
    created_at
) VALUES (
    'Demo Student', 
    'demo@student.com', 
    '+91 9876543210', 
    'Engineering College of Demo', 
    '3rd Year', 
    'Student - 3rd Year',
    NOW()
);
