-- Fix RLS policies for projects, services, and contacts tables
-- Run this in your Supabase SQL Editor

-- Fix projects table RLS policy
DROP POLICY IF EXISTS "Admin can manage projects" ON projects;
CREATE POLICY "Admin can manage projects" ON projects
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix services table RLS policy  
DROP POLICY IF EXISTS "Admin can manage services" ON services;
CREATE POLICY "Admin can manage services" ON services
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix contacts table RLS policy
DROP POLICY IF EXISTS "Admin can manage contacts" ON contacts;
CREATE POLICY "Admin can manage contacts" ON contacts
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Fix storage policies for project images bucket
-- Allow public read access for everyone to view images
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-images');

-- Allow authenticated admin users to upload images
DROP POLICY IF EXISTS "Authenticated can upload project images" ON storage.objects;
CREATE POLICY "Authenticated can upload project images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-images' 
        AND auth.uid() IS NOT NULL
    );

-- Allow authenticated admin users to update images
DROP POLICY IF EXISTS "Authenticated can update project images" ON storage.objects;
CREATE POLICY "Authenticated can update project images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'project-images' 
        AND auth.uid() IS NOT NULL
    );

-- Allow authenticated admin users to delete images
DROP POLICY IF EXISTS "Authenticated can delete project images" ON storage.objects;
CREATE POLICY "Authenticated can delete project images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'project-images' 
        AND auth.uid() IS NOT NULL
    );