/*
  # Add Website and Instagram URLs to Hotels

  1. Changes
    - Add `website_url` column to hotels table (text, nullable)
    - Add `instagram_url` column to hotels table (text, nullable)
  
  2. Purpose
    - Allow hotels to link to their official website
    - Allow hotels to link to their Instagram profile
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hotels' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE hotels ADD COLUMN website_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hotels' AND column_name = 'instagram_url'
  ) THEN
    ALTER TABLE hotels ADD COLUMN instagram_url text;
  END IF;
END $$;