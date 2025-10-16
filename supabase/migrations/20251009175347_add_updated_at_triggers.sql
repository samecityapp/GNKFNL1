/*
  # Add Automatic updated_at Triggers

  ## Overview
  This migration creates automatic triggers to update the `updated_at` timestamp
  whenever a row is modified. This ensures data consistency and removes the need
  to manually set timestamps in application code.

  ## How It Works
  1. Create a reusable function `update_updated_at_column()`
  2. Attach triggers to tables that have `updated_at` columns
  3. Triggers fire BEFORE UPDATE on each row
  4. Automatically sets `updated_at` to current timestamp

  ## Tables with Triggers
  1. hotels
  2. groups

  ## Benefits
  - Data consistency - timestamps always accurate
  - Less error-prone - no manual timestamp management
  - Audit trail - automatic tracking of last modification time
  - Database-level guarantee - can't be bypassed by application code

  ## Important Notes
  - Function is idempotent (safe to run multiple times)
  - Triggers only fire on UPDATE, not INSERT
  - `created_at` remains unchanged after initial insert
*/

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (idempotent)
DROP TRIGGER IF EXISTS update_hotels_updated_at ON hotels;
DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;

-- Create triggers for hotels table
CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for groups table
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
