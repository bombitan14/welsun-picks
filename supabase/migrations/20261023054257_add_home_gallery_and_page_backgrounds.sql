/*
# Add homepage gallery and editable page backgrounds

1. New Columns on `site_content`
- `home_gallery_urls`: Ordered list of public image URLs shown in the homepage slider.
- `home_background_url`: Optional background image for the homepage hero.
- `about_background_url`: Optional background image for the About Us page.
- `contact_background_url`: Optional background image for the Contact Us page.

2. Modified Tables
- `site_content`: Adds non-destructive image presentation fields. Existing text, links, and rows remain unchanged.
- `storage.objects`: Restricts administrator uploads in the public bucket to the known content folders and common image extensions, with a 10 MB object limit.

3. Security
- Existing `site_content` public-read and admin-write RLS policies continue to protect the new columns.
- Storage remains publicly readable so published images can load for visitors.
- Authenticated uploads, updates, and deletes are limited to `logos`, `home-gallery`, and `backgrounds` paths, image extensions, and objects no larger than 10 MB.
- Existing admin ownership check is retained for all storage writes.

4. Important Notes
- The homepage gallery preserves upload order and displays the images as a slider.
- Empty background URLs keep the existing gradient design as a fallback.
- No existing records or files are deleted by this migration.
*/

ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS home_gallery_urls text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS home_background_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_background_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_background_url text NOT NULL DEFAULT '';

DROP POLICY IF EXISTS "admin_upload_storage" ON storage.objects;
CREATE POLICY "admin_upload_storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'public'
    AND (storage.foldername(name))[1] IN ('logos', 'home-gallery', 'backgrounds')
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
    AND COALESCE((metadata->>'size')::bigint, 0) <= 10485760
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_update_storage" ON storage.objects;
CREATE POLICY "admin_update_storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'public'
    AND (storage.foldername(name))[1] IN ('logos', 'home-gallery', 'backgrounds')
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'public'
    AND (storage.foldername(name))[1] IN ('logos', 'home-gallery', 'backgrounds')
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
    AND COALESCE((metadata->>'size')::bigint, 0) <= 10485760
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_delete_storage" ON storage.objects;
CREATE POLICY "admin_delete_storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'public'
    AND (storage.foldername(name))[1] IN ('logos', 'home-gallery', 'backgrounds')
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );
