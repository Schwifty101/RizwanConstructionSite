-- ==================================
-- RIZWAN CONSTRUCTION WEBSITE DATABASE SETUP
-- ==================================
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

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_contacts_timestamp ON contacts(timestamp DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (active = true);

-- Create policies for admin access (allows all operations for now)
-- In production, you should restrict these to authenticated admin users
DROP POLICY IF EXISTS "Admin can manage projects" ON projects;
CREATE POLICY "Admin can manage projects" ON projects
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin can manage services" ON services;
CREATE POLICY "Admin can manage services" ON services
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin can manage contacts" ON contacts;
CREATE POLICY "Admin can manage contacts" ON contacts
    FOR ALL USING (true);

-- Create storage bucket for project images (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admin can upload project images" ON storage.objects;
CREATE POLICY "Admin can upload project images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admin can update project images" ON storage.objects;
CREATE POLICY "Admin can update project images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admin can delete project images" ON storage.objects;
CREATE POLICY "Admin can delete project images" ON storage.objects
    FOR DELETE USING (bucket_id = 'project-images');

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

-- Insert sample services data
INSERT INTO services (name, description, order_index) VALUES
('Residential Construction', 'Complete home building services from foundation to finish', 1),
('Interior Design', 'Professional interior design consulting and implementation', 2),
('Kitchen Remodeling', 'Custom kitchen design and renovation services', 3),
('Bathroom Renovation', 'Modern bathroom design and construction', 4),
('Commercial Construction', 'Office and retail space construction and renovation', 5),
('Project Consultation', 'Expert advice and project planning services', 6)
ON CONFLICT DO NOTHING;

-- Insert sample projects data
INSERT INTO projects (title, description, category, date, location, slug, featured) VALUES
('Modern Family Home', 'Contemporary 3-bedroom home with open floor plan and sustainable features', 'Residential', '2024-01-15', 'Downtown District', 'modern-family-home', true),
('Luxury Kitchen Remodel', 'Complete kitchen transformation with custom cabinetry and premium appliances', 'Interior Design', '2024-02-28', 'Suburban Area', 'luxury-kitchen-remodel', true),
('Office Space Renovation', 'Modern office design focusing on productivity and employee wellness', 'Commercial', '2024-03-10', 'Business District', 'office-space-renovation', false),
('Custom Home Addition', 'Two-story addition with master suite and family room', 'Residential', '2024-04-05', 'Hillside Community', 'custom-home-addition', true),
('Restaurant Buildout', 'Complete restaurant interior design and construction', 'Commercial', '2024-05-20', 'City Center', 'restaurant-buildout', false),
('Bathroom Spa Conversion', 'Master bathroom transformation into luxury spa retreat', 'Interior Design', '2024-06-12', 'Lakefront Property', 'bathroom-spa-conversion', false)
ON CONFLICT (slug) DO NOTHING;

-- Success message
SELECT 'Database setup completed successfully! All tables, policies, and sample data have been created.' as status;