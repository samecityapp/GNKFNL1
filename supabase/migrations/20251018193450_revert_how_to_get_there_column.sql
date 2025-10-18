/*
  # Revert how_to_get_there column from hotels table

  1. Changes
    - Remove `how_to_get_there` column from hotels table
*/

ALTER TABLE hotels
DROP COLUMN IF EXISTS how_to_get_there;