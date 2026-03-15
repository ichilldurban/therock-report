-- ═══════════════════════════════════════════════════════════════
-- The Rock Church — Sunday Service Report App
-- Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Sundays table
CREATE TABLE sundays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  notes TEXT,
  is_special BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table (2 per Sunday: 8am and 10am)
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sunday_id UUID REFERENCES sundays(id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('8am', '10am')),
  count_left INTEGER DEFAULT 0,
  count_centre INTEGER DEFAULT 0,
  count_right INTEGER DEFAULT 0,
  count_extras INTEGER DEFAULT 0,
  count_mothers INTEGER DEFAULT 0,
  UNIQUE(sunday_id, time_slot)
);

-- Team members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sunday_id UUID REFERENCES sundays(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('platform', 'operations', 'frontOfHouse')),
  role TEXT NOT NULL,
  name TEXT NOT NULL
);

-- Photos table (URLs to Supabase Storage)
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sunday_id UUID REFERENCES sundays(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('worship8', 'service8', 'worship10', 'service10')),
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- Public can view, only authenticated users can modify
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE sundays ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view sundays" ON sundays FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Public can view team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public can view photos" ON photos FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Auth can insert sundays" ON sundays FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update sundays" ON sundays FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete sundays" ON sundays FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth can insert services" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update services" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete services" ON services FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth can insert team_members" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update team_members" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete team_members" ON team_members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth can insert photos" ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth can update photos" ON photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth can delete photos" ON photos FOR DELETE USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
-- Storage bucket for photos
-- Run this AFTER creating the bucket manually in Supabase Dashboard:
-- Storage → New Bucket → Name: "service-photos" → Public: ON
-- ═══════════════════════════════════════════════════════════════

-- Storage policies (run in SQL editor after bucket creation)
-- CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'service-photos');
-- CREATE POLICY "Auth can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-photos' AND auth.role() = 'authenticated');
-- CREATE POLICY "Auth can delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'service-photos' AND auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
-- Seed data (9 March & 15 March 2026)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO sundays (date, notes, is_special) VALUES
  ('2026-03-09', NULL, FALSE),
  ('2026-03-15', NULL, FALSE);

-- 9 March services
INSERT INTO services (sunday_id, time_slot, count_left, count_centre, count_right, count_extras, count_mothers)
SELECT id, '8am', 49, 53, 33, 3, 5 FROM sundays WHERE date = '2026-03-09'
UNION ALL
SELECT id, '10am', 42, 59, 34, 11, 2 FROM sundays WHERE date = '2026-03-09';

-- 15 March services
INSERT INTO services (sunday_id, time_slot, count_left, count_centre, count_right, count_extras, count_mothers)
SELECT id, '8am', 39, 50, 43, 13, 8 FROM sundays WHERE date = '2026-03-15'
UNION ALL
SELECT id, '10am', 54, 56, 31, 11, 1 FROM sundays WHERE date = '2026-03-15';

-- 15 March serving teams
INSERT INTO team_members (sunday_id, category, role, name)
SELECT id, 'platform', 'Preaching', 'Mark' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'platform', 'Leading', 'Tom & Luke' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'platform', 'Worship', 'Nate' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'operations', 'Media', 'Luc' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'operations', 'Tea Team', 'Nicole & Merylin' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'operations', 'Hang Tight', 'Stef Coetzee' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'operations', 'Host', 'Gen Coetzee' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'operations', 'Lockup', 'Wayne' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'operations', 'Tithes', 'Crystal & Kelly' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'frontOfHouse', 'Welcome Team', 'Paige, Karin, Cam & Candice' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'frontOfHouse', 'Hosting', 'Chad, Lelo, Olo & Duncan' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'frontOfHouse', 'Coffee Shop', 'Ethan, Bianca & Gareth' FROM sundays WHERE date = '2026-03-15'
UNION ALL SELECT id, 'frontOfHouse', 'Car Park', 'Flip & Edwin' FROM sundays WHERE date = '2026-03-15';
