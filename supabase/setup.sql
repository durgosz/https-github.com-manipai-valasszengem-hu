-- valasszengem.hu admin setup
-- Futtasd le ezt a Supabase SQL Editorban

-- 1. Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT DEFAULT '',
  excerpt     TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  category    TEXT DEFAULT 'Önismeret',
  read_time   TEXT DEFAULT '5 perc',
  published   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Page content (CMS)
CREATE TABLE IF NOT EXISTS pages (
  id         TEXT PRIMARY KEY,
  sections   JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Design settings (single row, id=1)
CREATE TABLE IF NOT EXISTS design_settings (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  primary_color TEXT DEFAULT '#C9A96E',
  hero_overlay  INTEGER DEFAULT 40,
  cta_text      TEXT DEFAULT 'Időpontfoglalás',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO design_settings (id, primary_color, hero_overlay, cta_text)
VALUES (1, '#C9A96E', 40, 'Időpontfoglalás')
ON CONFLICT (id) DO NOTHING;

-- Default page content
INSERT INTO pages (id, sections) VALUES
  ('home', '{"hero_title": "Készen állsz a változásra?", "hero_subtitle": "Pszichológus-segítő online és személyes életvezetési tanácsadást kínálok.", "hero_cta": "Időpontfoglalás", "about_preview": ""}'),
  ('about', '{"bio_main": "", "bio_detail": "", "topics": ""}'),
  ('services', '{}'),
  ('pricing', '{}'),
  ('contact', '{}')
ON CONFLICT (id) DO NOTHING;

-- 4. Site images
CREATE TABLE IF NOT EXISTS site_images (
  id           TEXT PRIMARY KEY,
  storage_path TEXT,
  public_url   TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Public read for published posts (blog frontend)
CREATE POLICY "Public read published posts"
  ON posts FOR SELECT
  USING (published = true);

-- Public read for design settings (dynamic CSS)
CREATE POLICY "Public read design settings"
  ON design_settings FOR SELECT
  USING (true);

-- Public read for pages (hero/CMS content for frontend)
CREATE POLICY "Public read pages"
  ON pages FOR SELECT
  USING (true);

-- Public read for site images (frontend image URLs)
CREATE POLICY "Public read site images"
  ON site_images FOR SELECT
  USING (true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Auth full access posts"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth full access pages"
  ON pages FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth full access design"
  ON design_settings FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth full access images"
  ON site_images FOR ALL
  USING (auth.role() = 'authenticated');

-- Storage bucket: site-images (public)
-- Hozd létre a Supabase Storage > New bucket menüben:
-- Name: site-images, Public: YES

-- Szükséges env változók (.env.local és Vercel):
-- NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
-- SUPABASE_SERVICE_ROLE_KEY=eyJ...
-- ANTHROPIC_API_KEY=sk-ant-... (Mira Content Agent-hez)

-- Admin felhasználó létrehozása:
-- Supabase Dashboard > Authentication > Users > Add user
-- Email + jelszó megadása (ez lesz a /admin/login bejelentkezési adat)
