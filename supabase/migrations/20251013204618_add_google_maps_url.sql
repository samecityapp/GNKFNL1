/*
  # Add Google Maps URL Support

  1. Changes
    - Add `google_maps_url` column to `hotels` table
      - Stores the full Google Maps share link for each hotel
      - Optional field (nullable)
      - Text type to support long URLs with parameters
  
  2. Notes
    - This allows hotels to be displayed in native Google Maps app on mobile
    - URLs can be in format: https://www.google.com/maps/place/...
    - When clicked on mobile, opens native Maps app automatically
*/

-- Add google_maps_url column to hotels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hotels' AND column_name = 'google_maps_url'
  ) THEN
    ALTER TABLE hotels ADD COLUMN google_maps_url text;
  END IF;
END $$;