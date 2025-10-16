/*
  # Complete Database Schema for Hotel Booking Platform

  ## Overview
  This migration creates the complete database structure for a hotel booking platform
  with groups, tags, price filters, and search terms.

  ## New Tables
  
  ### 1. `groups`
  - `id` (uuid, primary key)
  - `title` (text) - Group display name
  - `is_published` (boolean) - Visibility status
  - `created_at`, `updated_at` (timestamptz)

  ### 2. `group_hotels`
  - Many-to-many relationship between groups and hotels
  - `group_id` (uuid, foreign key)
  - `hotel_id` (uuid, foreign key)
  - `order_index` (integer) - Display order

  ### 3. `tags`
  - Feature tags (e.g., "Denize Sıfır", "Jakuzili")
  - `name`, `slug`, `icon`, `is_featured`

  ### 4. `price_tags`
  - Price range filters
  - `label`, `slug`, `min_price`, `max_price`

  ### 5. `search_terms`
  - Popular search terms
  - `term`, `slug`

  ## Modified Tables
  - `hotels` - Added: about, about_facility, rules, video_url, gallery_images, latitude, longitude

  ## Security
  - RLS enabled on all tables
  - Public read access (no auth required)
*/

-- Add new columns to hotels table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'about') THEN
    ALTER TABLE hotels ADD COLUMN about text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'about_facility') THEN
    ALTER TABLE hotels ADD COLUMN about_facility text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'rules') THEN
    ALTER TABLE hotels ADD COLUMN rules text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'video_url') THEN
    ALTER TABLE hotels ADD COLUMN video_url text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'gallery_images') THEN
    ALTER TABLE hotels ADD COLUMN gallery_images text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'latitude') THEN
    ALTER TABLE hotels ADD COLUMN latitude numeric(10, 8);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hotels' AND column_name = 'longitude') THEN
    ALTER TABLE hotels ADD COLUMN longitude numeric(11, 8);
  END IF;
END $$;

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_hotels junction table
CREATE TABLE IF NOT EXISTS group_hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, hotel_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT 'Tag',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create price_tags table
CREATE TABLE IF NOT EXISTS price_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  slug text UNIQUE NOT NULL,
  min_price integer NOT NULL DEFAULT 0,
  max_price integer NOT NULL DEFAULT 999999,
  created_at timestamptz DEFAULT now()
);

-- Create search_terms table
CREATE TABLE IF NOT EXISTS search_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_groups_published ON groups(is_published);
CREATE INDEX IF NOT EXISTS idx_tags_featured ON tags(is_featured);
CREATE INDEX IF NOT EXISTS idx_group_hotels_group ON group_hotels(group_id);
CREATE INDEX IF NOT EXISTS idx_group_hotels_hotel ON group_hotels(hotel_id);

-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_terms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read all hotels" ON hotels;
DROP POLICY IF EXISTS "Public can read all groups" ON groups;
DROP POLICY IF EXISTS "Public can read group_hotels" ON group_hotels;
DROP POLICY IF EXISTS "Public can read all tags" ON tags;
DROP POLICY IF EXISTS "Public can read all price_tags" ON price_tags;
DROP POLICY IF EXISTS "Public can read all search_terms" ON search_terms;

-- Create public read policies
CREATE POLICY "Public can read all hotels"
  ON hotels FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read all groups"
  ON groups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read group_hotels"
  ON group_hotels FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read all tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read all price_tags"
  ON price_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read all search_terms"
  ON search_terms FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert default tags
INSERT INTO tags (name, slug, icon, is_featured) VALUES
  ('Denize Sıfır', 'denize-sifir', 'Waves', true),
  ('Jakuzili', 'jakuzili', 'Bath', true),
  ('Romantik', 'romantik', 'Heart', false),
  ('Alkolsüz', 'alkolsuz', 'GlassWater', true),
  ('Aile Oteli', 'aile-oteli', 'Users', true),
  ('Tarihi', 'tarihi', 'Landmark', false),
  ('Havuz', 'havuz', 'Droplets', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default price tags
INSERT INTO price_tags (label, slug, min_price, max_price) VALUES
  ('2000 TL Altı', '2000-alti', 0, 1999),
  ('2000-4000 TL', '2000-4000', 2000, 3999),
  ('4000-6000 TL', '4000-6000', 4000, 5999),
  ('6000-8000 TL', '6000-8000', 6000, 7999),
  ('8000 TL Üzeri', '8000-uzeri', 8000, 999999)
ON CONFLICT (slug) DO NOTHING;

-- Insert default search terms
INSERT INTO search_terms (term, slug) VALUES
  ('Fethiye Otelleri', 'fethiye'),
  ('Bodrum Otelleri', 'bodrum'),
  ('Herşey Dahil', 'hersey-dahil')
ON CONFLICT (slug) DO NOTHING;