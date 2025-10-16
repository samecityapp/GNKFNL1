/*
  # Add Video Support to Hotels

  ## Changes
  1. New Columns
    - `video_url` (text, nullable) - URL to the hotel's video in Supabase Storage
    - `video_thumbnail_url` (text, nullable) - URL to auto-generated video thumbnail/poster
  
  2. Purpose
    - Allow hotels to have optional Instagram Reel-style videos
    - Videos will be displayed on homepage and hotel detail pages
    - Provides modern, engaging content alongside images
  
  3. Notes
    - Videos are optional - hotels can have video, photos, or both
    - Max recommended size: 100MB, 720P, 9:16 aspect ratio
    - Thumbnails will be auto-generated or manually uploaded
*/

-- Add video fields to hotels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hotels' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE hotels ADD COLUMN video_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hotels' AND column_name = 'video_thumbnail_url'
  ) THEN
    ALTER TABLE hotels ADD COLUMN video_thumbnail_url text;
  END IF;
END $$;