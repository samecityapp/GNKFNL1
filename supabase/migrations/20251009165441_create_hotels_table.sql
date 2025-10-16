/*
  # Hotels Table Migration

  ## Overview
  Creates the main hotels table for storing hotel information with all necessary fields.

  ## New Tables
    - `hotels`
      - `id` (uuid, primary key) - Unique identifier for each hotel
      - `name` (text) - Hotel name
      - `location` (text) - Hotel location/address
      - `description` (text) - Detailed hotel description
      - `price` (integer) - Price per night
      - `rating` (numeric) - Hotel rating (0-5)
      - `image_url` (text) - Main hotel image URL
      - `amenities` (text array) - List of hotel amenities
      - `tags` (text array) - Associated tags for filtering
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  ## Security
    - Enable RLS on `hotels` table
    - Add policy for public read access (anyone can view hotels)
    - Add policy for authenticated insert/update/delete (admin operations)

  ## Notes
    - Uses UUID for scalability
    - Timestamps for audit trail
    - Arrays for flexible amenities and tags
    - RLS ensures data security
*/

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  image_url text DEFAULT '',
  amenities text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view hotels (public access)
CREATE POLICY "Anyone can view hotels"
  ON hotels
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert hotels
CREATE POLICY "Authenticated users can insert hotels"
  ON hotels
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update hotels
CREATE POLICY "Authenticated users can update hotels"
  ON hotels
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete hotels
CREATE POLICY "Authenticated users can delete hotels"
  ON hotels
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_hotels_name ON hotels(name);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON hotels(location);
CREATE INDEX IF NOT EXISTS idx_hotels_tags ON hotels USING GIN(tags);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_hotels_updated_at ON hotels;
CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
