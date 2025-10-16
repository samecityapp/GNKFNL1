/*
  # Fix Restaurants and Add Coordinate Constraints
  
  ## Changes
  1. Fix restaurants table - add missing columns and fix CHECK constraint
  2. Add coordinate range validation to hotels table
  3. Add missing indexes for performance
  4. Switch full-text search to Turkish dictionary
  
  ## Details
  - Fix restaurants.price_level CHECK syntax
  - Add CHECK constraints for latitude (-90 to 90) and longitude (-180 to 180)
  - Add missing amenities GIN index
  - Update search trigger to use Turkish dictionary for better Turkish text search
*/

-- Fix restaurants table if needed
DO $$
BEGIN
  -- Add missing columns to restaurants
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'category') THEN
    ALTER TABLE restaurants ADD COLUMN category text NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'address') THEN
    ALTER TABLE restaurants ADD COLUMN address text NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'phone') THEN
    ALTER TABLE restaurants ADD COLUMN phone text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'rating') THEN
    ALTER TABLE restaurants ADD COLUMN rating numeric(3,1) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'price_level') THEN
    ALTER TABLE restaurants ADD COLUMN price_level integer DEFAULT 2 CHECK (price_level BETWEEN 1 AND 4);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'image_url') THEN
    ALTER TABLE restaurants ADD COLUMN image_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'gallery_images') THEN
    ALTER TABLE restaurants ADD COLUMN gallery_images text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'latitude') THEN
    ALTER TABLE restaurants ADD COLUMN latitude numeric(10,8);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'longitude') THEN
    ALTER TABLE restaurants ADD COLUMN longitude numeric(11,8);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'opening_hours') THEN
    ALTER TABLE restaurants ADD COLUMN opening_hours jsonb DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'features') THEN
    ALTER TABLE restaurants ADD COLUMN features text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'menu_url') THEN
    ALTER TABLE restaurants ADD COLUMN menu_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'website_url') THEN
    ALTER TABLE restaurants ADD COLUMN website_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'instagram_url') THEN
    ALTER TABLE restaurants ADD COLUMN instagram_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'google_maps_url') THEN
    ALTER TABLE restaurants ADD COLUMN google_maps_url text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'deleted_at') THEN
    ALTER TABLE restaurants ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

-- Add coordinate CHECK constraints to hotels
DO $$
BEGIN
  -- Check if constraint exists before adding
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'hotels_latitude_check'
  ) THEN
    ALTER TABLE hotels ADD CONSTRAINT hotels_latitude_check 
      CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'hotels_longitude_check'
  ) THEN
    ALTER TABLE hotels ADD CONSTRAINT hotels_longitude_check 
      CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180));
  END IF;
END $$;

-- Add coordinate CHECK constraints to restaurants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'restaurants_latitude_check'
  ) THEN
    ALTER TABLE restaurants ADD CONSTRAINT restaurants_latitude_check 
      CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'restaurants_longitude_check'
  ) THEN
    ALTER TABLE restaurants ADD CONSTRAINT restaurants_longitude_check 
      CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180));
  END IF;
END $$;

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_hotels_amenities ON hotels USING GIN(amenities);
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
CREATE INDEX IF NOT EXISTS idx_restaurants_coords ON restaurants(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_deleted_at ON restaurants(deleted_at);

-- Update full-text search trigger to use Turkish dictionary
CREATE OR REPLACE FUNCTION hotels_search_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('turkish', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('turkish', coalesce(NEW.location, '')), 'B') ||
    setweight(to_tsvector('turkish', coalesce(NEW.about, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger (it will use the updated function)
DROP TRIGGER IF EXISTS hotels_search_update ON hotels;
CREATE TRIGGER hotels_search_update
  BEFORE INSERT OR UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION hotels_search_trigger();

-- Add updated_at trigger to restaurants if not exists
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();