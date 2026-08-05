-- ===================================================
-- Astraea AI Court Management System - Supabase Schema
-- Run this script in your Supabase SQL Editor
-- ===================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Judge', 'Lawyer', 'Clerk')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cases Table
CREATE TABLE IF NOT EXISTS public.cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Criminal', 'Civil', 'Probate', 'Family', 'Appellate')),
  status TEXT NOT NULL CHECK (status IN ('Active', 'Pending', 'Closed', 'Under Review')),
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  next_hearing TIMESTAMPTZ,
  judge TEXT,
  lawyers TEXT[] DEFAULT '{}',
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Case Timelines Table
CREATE TABLE IF NOT EXISTS public.case_timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id TEXT REFERENCES public.cases(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- 4. Hearings / Schedule Table
CREATE TABLE IF NOT EXISTS public.hearings (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  room TEXT NOT NULL,
  judge TEXT NOT NULL,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Adjourned', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Case Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id TEXT REFERENCES public.cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Order', 'Evidence', 'Report', 'Motion', 'Filing')),
  file_url TEXT,
  file_size INT,
  summary TEXT,
  uploaded_by TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Audit Activity Log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Permissive policies for demo/application operational mode
CREATE POLICY "Public read cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Public write cases" ON public.cases FOR ALL USING (true);

CREATE POLICY "Public read hearings" ON public.hearings FOR SELECT USING (true);
CREATE POLICY "Public write hearings" ON public.hearings FOR ALL USING (true);

CREATE POLICY "Public read documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public write documents" ON public.documents FOR ALL USING (true);

CREATE POLICY "Public read timelines" ON public.case_timelines FOR SELECT USING (true);
CREATE POLICY "Public write timelines" ON public.case_timelines FOR ALL USING (true);

CREATE POLICY "Public read audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Public write audit_logs" ON public.audit_logs FOR ALL USING (true);

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON public.profiles FOR ALL USING (true);

-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hearings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;

-- Seed Sample Initial Cases
INSERT INTO public.cases (id, title, type, status, priority, next_hearing, judge, lawyers, description)
VALUES 
  ('C-2026-001', 'State vs. Doe', 'Criminal', 'Active', 'High', '2026-05-15 09:00:00+00', 'Hon. Smith', ARRAY['John Wick', 'Jane Doe'], 'Robbery charges in the 1st degree.'),
  ('C-2026-002', 'TechCorp vs. InnovateLLC', 'Civil', 'Pending', 'Medium', '2026-06-02 14:00:00+00', 'Hon. Davis', ARRAY['Alice Smith'], 'Patent infringement dispute over AI algorithms.'),
  ('C-2026-003', 'Estate of Wayne', 'Probate', 'Closed', 'Low', NULL, 'Hon. Miller', ARRAY[]::TEXT[], 'Execution of the Wayne estate and trust.'),
  ('C-2026-004', 'City of Metropolis vs. LexCorp', 'Civil', 'Active', 'High', '2026-05-20 10:30:00+00', 'Hon. Smith', ARRAY['Bruce Wayne'], 'Environmental damages and zoning law violations.')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Schedule
INSERT INTO public.hearings (id, case_id, title, date, type, room, judge, status)
VALUES
  ('S-101', 'C-2026-001', 'Arraignment: State vs. Doe', '2026-05-15 09:00:00+00', 'Arraignment', 'Courtroom 3A', 'Hon. Smith', 'Scheduled'),
  ('S-102', 'C-2026-002', 'Preliminary Hearing: TechCorp', '2026-06-02 14:00:00+00', 'Preliminary Hearing', 'Courtroom 1B', 'Hon. Davis', 'Scheduled'),
  ('S-103', 'C-2026-004', 'Motion to Dismiss: LexCorp', '2026-05-20 10:30:00+00', 'Motion', 'Courtroom 2C', 'Hon. Smith', 'Scheduled')
ON CONFLICT (id) DO NOTHING;
