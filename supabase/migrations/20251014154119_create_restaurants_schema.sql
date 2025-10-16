/*
  # Create Restaurants and Location-Based Dining Schema

  ## Overview
  This migration creates tables for managing restaurant recommendations based on hotel locations.
  
  ## New Tables
  
  ### `restaurant_categories`
  - `id` (uuid, primary key)
  - `title` (text) - Category name (e.g., "En İyi Hamburgerciler", "En İyi Kahveciler")
  - `display_order` (integer) - Order to display categories
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `restaurants`
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key to restaurant_categories)
  - `location` (text) - City/district name (e.g., "Fethiye", "Antalya")
  - `name` (text) - Restaurant name
  - `image_url` (text) - Restaurant image
  - `description` (text) - Brief description
  - `google_rating` (decimal) - Google rating score
  - `review_count` (text) - Number of reviews
  - `order_suggestion` (text) - What to order
  - `display_order` (integer) - Order within category
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `restaurant_notes`
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid, foreign key to restaurants)
  - `emoji` (text) - Emoji icon
  - `text` (text) - Note content
  - `display_order` (integer) - Order of notes
  - `created_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Public read access for all users
  - Admin-only write access (authenticated users)
  
  ## Indexes
  - Index on location for fast filtering
  - Index on category_id for joins
  - Index on display_order for sorting
*/

-- Create restaurant_categories table
CREATE TABLE IF NOT EXISTS restaurant_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES restaurant_categories(id) ON DELETE CASCADE,
  location text NOT NULL,
  name text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  google_rating decimal(2,1) NOT NULL DEFAULT 0.0,
  review_count text NOT NULL DEFAULT '0',
  order_suggestion text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create restaurant_notes table
CREATE TABLE IF NOT EXISTS restaurant_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(location);
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_display_order ON restaurants(display_order);
CREATE INDEX IF NOT EXISTS idx_restaurant_notes_restaurant ON restaurant_notes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_notes_display_order ON restaurant_notes(display_order);

-- Enable RLS
ALTER TABLE restaurant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_notes ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read restaurant categories"
  ON restaurant_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read restaurants"
  ON restaurants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read restaurant notes"
  ON restaurant_notes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write policies for restaurant_categories
CREATE POLICY "Authenticated users can insert categories"
  ON restaurant_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON restaurant_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON restaurant_categories FOR DELETE
  TO authenticated
  USING (true);

-- Admin write policies for restaurants
CREATE POLICY "Authenticated users can insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update restaurants"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete restaurants"
  ON restaurants FOR DELETE
  TO authenticated
  USING (true);

-- Admin write policies for restaurant_notes
CREATE POLICY "Authenticated users can insert notes"
  ON restaurant_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update notes"
  ON restaurant_notes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete notes"
  ON restaurant_notes FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_restaurant_categories_updated_at ON restaurant_categories;
CREATE TRIGGER update_restaurant_categories_updated_at
  BEFORE UPDATE ON restaurant_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();