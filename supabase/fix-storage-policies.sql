-- Fix storage policies for service-images and project-images buckets
-- Run this in your Supabase SQL Editor if you're having RLS issues with image uploads

-- First, ensure the buckets exist and are properly configured
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('project-images', 'project-images', true, 10485760, '{"image/*"}'),
  ('service-images', 'service-images', true, 10485760, '{"image/*"}')
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete project images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update service images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete service images" ON storage.objects;

-- Project images storage policies
CREATE POLICY "Public can view project images" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admin can upload project images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can update project images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete project images" ON storage.objects
    FOR DELETE USING (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

-- Service images storage policies
CREATE POLICY "Public can view service images" ON storage.objects
    FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Admin can upload service images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'service-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can update service images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'service-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can delete service images" ON storage.objects
    FOR DELETE USING (bucket_id = 'service-images' AND auth.uid() IS NOT NULL);

-- Verify the policies are in place
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

SELECT 'Storage policies have been applied successfully!' as status;