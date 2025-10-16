/*
  # Add Write/Update/Delete Policies for Admin Operations

  ## Overview
  This migration adds comprehensive RLS policies to allow write operations on all tables.
  Currently only SELECT policies exist - this adds INSERT, UPDATE, and DELETE policies.

  ## Security Strategy
  - Public read access (existing)
  - Write operations allowed for all users (no authentication required for MVP)
  - In production, these should be restricted to authenticated admin users

  ## Tables Updated
  1. hotels - INSERT, UPDATE, DELETE policies
  2. groups - INSERT, UPDATE, DELETE policies
  3. group_hotels - INSERT, UPDATE, DELETE policies
  4. tags - INSERT, UPDATE, DELETE policies
  5. price_tags - INSERT, UPDATE, DELETE policies
  6. search_terms - INSERT, UPDATE, DELETE policies

  ## Important Notes
  - These policies allow unrestricted write access for MVP
  - For production, replace `USING (true)` with `USING (auth.uid() IS NOT NULL AND auth.jwt()->>'role' = 'admin')`
*/

-- Hotels table policies
CREATE POLICY "Public can insert hotels"
  ON hotels FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update hotels"
  ON hotels FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete hotels"
  ON hotels FOR DELETE
  TO anon, authenticated
  USING (true);

-- Groups table policies
CREATE POLICY "Public can insert groups"
  ON groups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update groups"
  ON groups FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete groups"
  ON groups FOR DELETE
  TO anon, authenticated
  USING (true);

-- Group_hotels table policies
CREATE POLICY "Public can insert group_hotels"
  ON group_hotels FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update group_hotels"
  ON group_hotels FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete group_hotels"
  ON group_hotels FOR DELETE
  TO anon, authenticated
  USING (true);

-- Tags table policies
CREATE POLICY "Public can insert tags"
  ON tags FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update tags"
  ON tags FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete tags"
  ON tags FOR DELETE
  TO anon, authenticated
  USING (true);

-- Price_tags table policies
CREATE POLICY "Public can insert price_tags"
  ON price_tags FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update price_tags"
  ON price_tags FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete price_tags"
  ON price_tags FOR DELETE
  TO anon, authenticated
  USING (true);

-- Search_terms table policies
CREATE POLICY "Public can insert search_terms"
  ON search_terms FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update search_terms"
  ON search_terms FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete search_terms"
  ON search_terms FOR DELETE
  TO anon, authenticated
  USING (true);
