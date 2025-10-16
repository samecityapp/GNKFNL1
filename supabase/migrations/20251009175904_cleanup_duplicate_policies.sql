/*
  # Clean Up Duplicate RLS Policies

  ## Overview
  The hotels table has duplicate policies from multiple migrations:
  - "Anyone can view hotels" (old, filters nothing)
  - "Public can read all hotels" (new, filters deleted_at)
  - Duplicate authenticated/public insert/update/delete policies

  This migration removes the outdated and duplicate policies.

  ## Changes Made
  1. Remove old "Anyone can view hotels" policy (superseded by soft-delete aware policy)
  2. Remove duplicate "Authenticated users can..." policies (superseded by "Public can..." policies)

  ## Final State
  Each table will have clean, non-duplicate policies:
  - SELECT: Filters by deleted_at IS NULL
  - INSERT: Public access with CHECK (true)
  - UPDATE: Public access with USING/CHECK (true)
  - DELETE: Public access with USING (true)

  ## Important Notes
  - This only affects the hotels table which has duplicates
  - Other tables already have clean policies
  - No functionality is lost, only cleanup
*/

-- Remove duplicate/outdated SELECT policies on hotels
DROP POLICY IF EXISTS "Anyone can view hotels" ON hotels;

-- Remove duplicate INSERT policies on hotels
DROP POLICY IF EXISTS "Authenticated users can insert hotels" ON hotels;

-- Remove duplicate UPDATE policies on hotels
DROP POLICY IF EXISTS "Authenticated users can update hotels" ON hotels;

-- Remove duplicate DELETE policies on hotels
DROP POLICY IF EXISTS "Authenticated users can delete hotels" ON hotels;

-- All tables now have clean, single policies per operation type
