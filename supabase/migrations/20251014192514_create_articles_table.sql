/*
  # Create articles table for blog/guide content

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly identifier
      - `content` (text) - Article content (HTML/Markdown)
      - `cover_image_url` (text) - Main article image
      - `location` (text) - Related location (e.g., "Fethiye")
      - `meta_description` (text) - SEO description
      - `is_published` (boolean) - Publication status
      - `published_at` (timestamptz) - Publication timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `deleted_at` (timestamptz) - Soft delete timestamp

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access (published articles only)
    - Add policy for admin full access

  3. Performance
    - Add index on `location` for fast location-based queries
    - Add index on `is_published` for filtering published articles
*/

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    location TEXT NOT NULL,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_articles_location ON articles(location);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published articles"
  ON articles
  FOR SELECT
  USING (is_published = true AND deleted_at IS NULL);

CREATE POLICY "Admin full access on articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);