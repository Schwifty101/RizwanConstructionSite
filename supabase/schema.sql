-- ==================================
-- TheNewHome INTERIOR DESIGN WEBSITE DATABASE SETUP
-- ==================================
-- For "TheNewHome - Where Dreams Take Shape"
-- Interior Design Services Database
-- Run this entire script in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- Copy and paste this entire script, then click "Run"

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    images TEXT[] DEFAULT '{}',
    date DATE NOT NULL,
    location VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Contacts are handled via API/email, no database table needed

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_projects_featured_date ON projects(featured, date DESC) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_category_date ON projects(category, date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON services(active, order_index) WHERE active = true;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_composite ON projects(category, featured, date DESC);

-- Text search indexes (for future search functionality)
CREATE INDEX IF NOT EXISTS idx_projects_title_search ON projects USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_projects_description_search ON projects USING gin(to_tsvector('english', description));

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (active = true);

-- Create policies for admin access (requires authentication)
-- Only authenticated users can manage projects and services
DROP POLICY IF EXISTS "Admin can manage projects" ON projects;
CREATE POLICY "Admin can manage projects" ON projects
    FOR ALL USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can manage services" ON services;
CREATE POLICY "Admin can manage services" ON services
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Create storage buckets (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for both buckets
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
CREATE POLICY "Public can view all bucket images" ON storage.objects
    FOR SELECT USING (bucket_id IN ('project-images', 'service-images'));

DROP POLICY IF EXISTS "Admin can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload service images" ON storage.objects;
CREATE POLICY "Admin can upload all bucket images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id IN ('project-images', 'service-images') AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update service images" ON storage.objects;
CREATE POLICY "Admin can update all bucket images" ON storage.objects
    FOR UPDATE USING (bucket_id IN ('project-images', 'service-images') AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete service images" ON storage.objects;
CREATE POLICY "Admin can delete all bucket images" ON storage.objects
    FOR DELETE USING (bucket_id IN ('project-images', 'service-images') AND auth.uid() IS NOT NULL);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert updated services data for "TheNewHome"
INSERT INTO services (name, description, order_index) VALUES
-- Main Service Categories
('Texture Coating & Zola Paint', 'Expert texture coatings and zola paint application for flawless wall finishes', 1),
('Window Blinds', 'Custom-tailored window blinds designed to match your space character', 2),
('Vinyl & Wooden Flooring', 'Premium flooring solutions including vinyl and wooden options', 3),
('False Ceilings', 'Elegant, purpose-built ceiling designs that complement your complete interior plan', 4),
('Aluminium & Glass Work', 'Professional aluminium and glass installations for modern aesthetics', 5),
-- Specialized Services
('Home Interiors', 'Complete interior solutions including doors, windows, ceilings, flooring, and furniture', 6),
('Hotel & Restaurant Interiors', 'International hospitality standard designs combining comfort, functionality, and aesthetics', 7),
('Office Interiors', 'Custom office plans for enhanced productivity featuring furniture, ceilings, reception areas, and carpets', 8),
('Windows (Wood & Aluminium)', 'Custom window designs seamlessly blending strength and style for timeless beauty', 9),
('Ceilings', 'Elegant, purpose-built ceiling designs crafted to complement your complete interior plan', 10),
('Blinds & Curtains', 'Tailored window treatments with precision to match your space character', 11),
('Paints & Finishes', 'Texture coatings to zola paints with color selection based on room size and light conditions', 12)
ON CONFLICT DO NOTHING;

-- Insert sample projects data for "TheNewHome"
INSERT INTO projects (title, description, category, date, location, slug, featured) VALUES
('Luxury Home Interior Transformation', 'Complete home interior makeover with custom texture coating, wooden flooring, and elegant false ceilings', 'Home Interiors', '2024-01-15', 'Downtown District', 'luxury-home-interior-transformation', true),
('Hotel Lobby Redesign', 'International standard hotel lobby design with custom aluminium work and premium blinds', 'Hotel & Restaurant Interiors', '2024-02-28', 'Business District', 'hotel-lobby-redesign', true),
('Modern Office Interior', 'Contemporary office space featuring custom ceilings, flooring, and window treatments', 'Office Interiors', '2024-03-10', 'Corporate Center', 'modern-office-interior', true),
('Restaurant Fine Dining Interior', 'Sophisticated restaurant interior with custom lighting, texture walls, and elegant finishes', 'Hotel & Restaurant Interiors', '2024-04-05', 'City Center', 'restaurant-fine-dining-interior', false),
('Residential Kitchen & Bath Remodel', 'Complete kitchen and bathroom renovation with premium finishes and custom fixtures', 'Home Interiors', '2024-05-20', 'Suburban Villa', 'residential-kitchen-bath-remodel', false),
('Corporate Reception Area', 'Professional reception area design with glass work, false ceilings, and branded elements', 'Office Interiors', '2024-06-12', 'Business Park', 'corporate-reception-area', false)
ON CONFLICT (slug) DO NOTHING;

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('project-images', 'project-images', true, 10485760, '{"image/*"}'),
  ('service-images', 'service-images', true, 10485760, '{"image/*"}')
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Note: RLS and policies are already enabled above, no duplicates needed

-- Success message
SELECT 'TheNewHome database setup completed successfully! Projects and services tables with sample interior design data have been created. Storage buckets and RLS policies are configured.' as status;