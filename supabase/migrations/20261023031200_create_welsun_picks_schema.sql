/*
# WELSUN PICKS - Database Schema

1. New Tables
- `admin_profiles`: links an authenticated Supabase Auth user to an admin username. Only users with a row here are considered admins.
- `site_content`: single-row table holding all editable public website content (homepage title/description, about us text, how-to-create-account instructions, contact info, logo URL).

2. Security
- `admin_profiles` is readable/writable only by the authenticated admin who owns the row.
- `site_content` is readable by everyone (anon + authenticated) but writable only by authenticated users who have a matching row in `admin_profiles`.
- RLS enabled on both tables. Four separate policies per table (SELECT/INSERT/UPDATE/DELETE).
- Grants restricted to the minimum needed roles and verbs.

3. Important Notes
- The admin user is created via Supabase Auth (email/password). A corresponding row is inserted into `admin_profiles` via execute_sql after the migration.
- Passwords are never stored in the database — Supabase Auth handles password hashing and verification.
- Public visitors (anon role) can only read site_content; they cannot modify anything.
*/

-- ============================================================
-- admin_profiles table (created first so site_content policies can reference it)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON admin_profiles TO authenticated;

DROP POLICY IF EXISTS "admin_read_own_profile" ON admin_profiles;
CREATE POLICY "admin_read_own_profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_insert_own_profile" ON admin_profiles;
CREATE POLICY "admin_insert_own_profile"
  ON admin_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_update_own_profile" ON admin_profiles;
CREATE POLICY "admin_update_own_profile"
  ON admin_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_delete_own_profile" ON admin_profiles;
CREATE POLICY "admin_delete_own_profile"
  ON admin_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- site_content table
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  home_title text NOT NULL DEFAULT 'Welcome to WELSUN PICKS',
  home_description text NOT NULL DEFAULT 'Your trusted source for premium picks and insights. We provide carefully curated selections to help you make informed decisions.',
  about_title text NOT NULL DEFAULT 'About WELSUN PICKS',
  about_description text NOT NULL DEFAULT 'WELSUN PICKS is dedicated to providing high-quality picks and insights. Our team of experts carefully analyzes each selection to ensure you receive the best possible recommendations. We pride ourselves on transparency, accuracy, and a commitment to excellence.',
  how_to_title text NOT NULL DEFAULT 'How to Create an Account',
  how_to_step1 text NOT NULL DEFAULT 'Visit our official Facebook page.',
  how_to_step2 text NOT NULL DEFAULT 'Contact our authorized representative.',
  how_to_step3 text NOT NULL DEFAULT 'Request account registration assistance.',
  how_to_step4 text NOT NULL DEFAULT 'Follow the provided instructions.',
  facebook_page text NOT NULL DEFAULT 'https://bit.ly/m/Welsunpicks',
  messenger_link text NOT NULL DEFAULT 'https://m.me/welsunpicks',
  email_address text NOT NULL DEFAULT 'welsunpicks@gmail.com',
  contact_person text NOT NULL DEFAULT 'WELSUN PICKS Representative',
  logo_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON site_content TO authenticated;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_site_content" ON site_content;
CREATE POLICY "admin_insert_site_content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_update_site_content" ON site_content;
CREATE POLICY "admin_update_site_content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_delete_site_content" ON site_content;
CREATE POLICY "admin_delete_site_content"
  ON site_content FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

-- ============================================================
-- Seed default content row if none exists
-- ============================================================
INSERT INTO site_content (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM site_content);
