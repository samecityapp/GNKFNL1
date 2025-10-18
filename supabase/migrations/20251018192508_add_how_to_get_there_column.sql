/*
  # Add how_to_get_there column to hotels table

  1. Changes
    - Add `how_to_get_there` column to hotels table
    - Column stores directions text for "Buraya nasıl giderim?" section
    - TEXT type to support detailed directions
*/

ALTER TABLE hotels
ADD COLUMN IF NOT EXISTS how_to_get_there TEXT;