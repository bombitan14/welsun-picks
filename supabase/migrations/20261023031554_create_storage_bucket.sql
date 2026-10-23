/*
# Create storage bucket for logo uploads

1. Storage
- Creates a 'public' storage bucket if it doesn't exist, set to public so logo images can be read by anyone.
- The admin can upload logos to the 'logos/' folder within this bucket.

2. Policies
- Public read access for all objects in the bucket.
- Only authenticated admins (users with a row in admin_profiles) can upload/update/delete objects.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy
DROP POLICY IF EXISTS "public_read_storage" ON storage.objects;
CREATE POLICY "public_read_storage"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'public');

-- Admin upload policy
DROP POLICY IF EXISTS "admin_upload_storage" ON storage.objects;
CREATE POLICY "admin_upload_storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'public'
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

-- Admin update policy
DROP POLICY IF EXISTS "admin_update_storage" ON storage.objects;
CREATE POLICY "admin_update_storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'public'
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'public'
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );

-- Admin delete policy
DROP POLICY IF EXISTS "admin_delete_storage" ON storage.objects;
CREATE POLICY "admin_delete_storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'public'
    AND EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid())
  );
