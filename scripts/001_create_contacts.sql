-- Create contacts/leads table for CRM
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  enquiry TEXT NOT NULL,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  message TEXT
);

-- Allow public inserts (no auth required for contact form)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Policy: only service role can read (admin access only)
CREATE POLICY "Service role can read contacts" ON public.contacts
  FOR SELECT USING (auth.role() = 'service_role');
