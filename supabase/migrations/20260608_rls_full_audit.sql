-- ============================================================
-- ValasszEngem – Teljes RLS + hiányzó táblák
-- Biztonságosan futtatható többször (IF NOT EXISTS / DO $$ blokkok)
-- Supabase SQL Editor > Run
-- ============================================================

-- ─── 1. admin_audit_logs tábla ──────────────────────────────
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID,
  user_email    TEXT,
  action        TEXT        NOT NULL,
  resource_type TEXT,
  resource_id   TEXT,
  metadata      JSONB       DEFAULT '{}',
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Csak service_role tud írni (az app service role kulccsal hív)
-- Olvasás: csak bejelentkezett admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_logs' AND policyname = 'Service role full access audit_logs'
  ) THEN
    CREATE POLICY "Service role full access audit_logs"
      ON admin_audit_logs FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_audit_logs' AND policyname = 'Authenticated read audit_logs'
  ) THEN
    CREATE POLICY "Authenticated read audit_logs"
      ON admin_audit_logs FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ─── 2. connections tábla (kapcsolatfelvételi form) ──────────
CREATE TABLE IF NOT EXISTS connections (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT,
  message        TEXT        NOT NULL,
  preferred_time TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Csak service_role tud beírni (contact form API route-ból)
-- Olvasás: csak bejelentkezett admin
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'connections' AND policyname = 'Service role full access connections'
  ) THEN
    CREATE POLICY "Service role full access connections"
      ON connections FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'connections' AND policyname = 'Authenticated read connections'
  ) THEN
    CREATE POLICY "Authenticated read connections"
      ON connections FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ─── 3. posts RLS – idempotent ellenőrzés ───────────────────
-- Ha a setup.sql már lefutott, ezek már léteznek. DO blokk véd.
ALTER TABLE IF EXISTS posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'posts' AND policyname = 'Public read published posts'
  ) THEN
    CREATE POLICY "Public read published posts"
      ON posts FOR SELECT
      USING (published = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'posts' AND policyname = 'Auth full access posts'
  ) THEN
    CREATE POLICY "Auth full access posts"
      ON posts FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ─── 4. pages RLS ────────────────────────────────────────────
ALTER TABLE IF EXISTS pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pages' AND policyname = 'Public read pages'
  ) THEN
    CREATE POLICY "Public read pages"
      ON pages FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pages' AND policyname = 'Auth full access pages'
  ) THEN
    CREATE POLICY "Auth full access pages"
      ON pages FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ─── 5. design_settings RLS ──────────────────────────────────
ALTER TABLE IF EXISTS design_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'design_settings' AND policyname = 'Public read design settings'
  ) THEN
    CREATE POLICY "Public read design settings"
      ON design_settings FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'design_settings' AND policyname = 'Auth full access design'
  ) THEN
    CREATE POLICY "Auth full access design"
      ON design_settings FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ─── 6. site_images RLS ──────────────────────────────────────
ALTER TABLE IF EXISTS site_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_images' AND policyname = 'Public read site_images'
  ) THEN
    CREATE POLICY "Public read site_images"
      ON site_images FOR SELECT
      USING (true);
  END IF;
END $$;

-- site_images írás: csak service_role (az API route admin klienssel ír)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_images' AND policyname = 'Service role full access site_images'
  ) THEN
    CREATE POLICY "Service role full access site_images"
      ON site_images FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ─── 7. Storage: site-images bucket policies ─────────────────
-- Ha még nem létezik a bucket policy, manuálisan add hozzá
-- Supabase > Storage > Policies > site-images:
--   SELECT: public (anon olvashat)
--   INSERT/UPDATE/DELETE: service_role only
-- Ezeket nem lehet SQL-ből kezelni egyszerűen, a Dashboard-ban állítsd be.

-- ─── ELLENŐRZÉSI LEKÉRDEZÉS ─────────────────────────────────
-- Futtasd ezt a végén, hogy lássad a policykat:
-- SELECT tablename, policyname, cmd, roles
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
