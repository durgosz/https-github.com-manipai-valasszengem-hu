-- AZONNALI JAVÍTÁS: futtasd le a Supabase SQL Editorban
-- Hibák: (1) nincs public read policy a pages táblán, (2) nincs home rekord

-- 1. Public read policy hozzáadása (anon kulccsal olvasható legyen a frontend számára)
CREATE POLICY "Public read pages"
  ON pages FOR SELECT
  USING (true);

-- 2. Default rekordok létrehozása (ha még nem léteznek)
INSERT INTO pages (id, sections) VALUES
  ('home', '{"hero_title": "Készen állsz a változásra?", "hero_subtitle": "Pszichológus-segítő online és személyes életvezetési tanácsadást kínálok.", "hero_cta": "Időpontfoglalás", "about_preview": ""}'),
  ('about', '{"bio_main": "", "bio_detail": "", "topics": ""}'),
  ('services', '{}'),
  ('pricing', '{}'),
  ('contact', '{}')
ON CONFLICT (id) DO NOTHING;
