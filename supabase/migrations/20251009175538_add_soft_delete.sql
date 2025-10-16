/*
  # Add Soft Delete Functionality

  ## Overview
  This migration adds soft delete capabilities to critical tables. Instead of permanently
  deleting records (hard delete), records are marked as deleted with a timestamp.
  This allows for data recovery, audit trails, and prevents accidental data loss.

  ## Changes Made

  ### 1. New Columns Added
  - `deleted_at` (timestamptz, nullable) - When the record was soft-deleted
  - NULL = active record
  - Non-NULL = soft-deleted record

  ### 2. Tables with Soft Delete
  1. hotels
  2. groups
  3. tags
  4. price_tags
  5. search_terms

  ### 3. Updated RLS Policies
  - Read policies now filter out soft-deleted records
  - Soft-deleted records are hidden from normal queries
  - Only show records where `deleted_at IS NULL`

  ### 4. Indexes Added
  - Index on `deleted_at` for fast filtering of active/deleted records

  ## Usage

  ### Soft Delete (Application Layer)
  ```typescript
  // Instead of: await db.hotels.delete(id)
  await db.hotels.update(id, { deleted_at: new Date() })
  ```

  ### Hard Delete (Permanent)
  ```sql
  -- Still available if needed
  DELETE FROM hotels WHERE id = 'xxx';
  ```

  ### Restore Soft-Deleted Record
  ```typescript
  await db.hotels.update(id, { deleted_at: null })
  ```

  ### Query Deleted Records
  ```sql
  SELECT * FROM hotels WHERE deleted_at IS NOT NULL;
  ```

  ## Benefits
  - Data recovery - Restore accidentally deleted records
  - Audit trail - Know when records were deleted
  - Referential integrity - Related records remain intact
  - Safety net - Protection against accidental deletion

  ## Important Notes
  - Application code should be updated to use soft delete
  - Hard delete still available for permanent removal
  - Deleted records don't appear in normal queries (RLS filters them)
  - Consider periodic cleanup of old soft-deleted records
*/

-- Add deleted_at columns to tables
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE tags ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE price_tags ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE search_terms ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Create indexes for deleted_at columns
CREATE INDEX IF NOT EXISTS idx_hotels_deleted_at ON hotels(deleted_at);
CREATE INDEX IF NOT EXISTS idx_groups_deleted_at ON groups(deleted_at);
CREATE INDEX IF NOT EXISTS idx_tags_deleted_at ON tags(deleted_at);
CREATE INDEX IF NOT EXISTS idx_price_tags_deleted_at ON price_tags(deleted_at);
CREATE INDEX IF NOT EXISTS idx_search_terms_deleted_at ON search_terms(deleted_at);

-- Update existing read policies to exclude soft-deleted records
DROP POLICY IF EXISTS "Public can read all hotels" ON hotels;
CREATE POLICY "Public can read all hotels"
  ON hotels FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can read all groups" ON groups;
CREATE POLICY "Public can read all groups"
  ON groups FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can read all tags" ON tags;
CREATE POLICY "Public can read all tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can read all price_tags" ON price_tags;
CREATE POLICY "Public can read all price_tags"
  ON price_tags FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Public can read all search_terms" ON search_terms;
CREATE POLICY "Public can read all search_terms"
  ON search_terms FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- Note: group_hotels junction table doesn't need soft delete
-- It will be handled via CASCADE when parent records are truly deleted
