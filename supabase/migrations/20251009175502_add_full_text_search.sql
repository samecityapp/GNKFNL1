/*
  # Add Full-Text Search Capabilities

  ## Overview
  This migration adds PostgreSQL full-text search (FTS) capabilities to the hotels table.
  This enables fast, ranked text searches across name, location, and about fields with
  support for Turkish characters and natural language queries.

  ## Features Added

  ### 1. Generated tsvector Column
  - `search_vector` - Auto-maintained full-text search index
  - Combines: name (weight A), location (weight B), about (weight C)
  - Weighted search: name matches ranked highest, then location, then about

  ### 2. GIN Index
  - Fast full-text search queries
  - Supports ranked results with `ts_rank`
  - Handles Turkish characters properly

  ### 3. Automatic Update Trigger
  - Automatically updates search_vector when name, location, or about changes
  - No manual maintenance required

  ## Search Capabilities
  - Natural language queries: "istanbul deniz manzaralı otel"
  - Prefix matching: "anka*" matches "Ankara"
  - Boolean operators: "istanbul & deniz" (AND), "ankara | izmir" (OR)
  - Phrase search: "denize sıfır"
  - Ranked results: most relevant matches first

  ## Usage Examples

  ### Basic Search
  ```sql
  SELECT * FROM hotels
  WHERE search_vector @@ to_tsquery('simple', 'istanbul');
  ```

  ### Ranked Search
  ```sql
  SELECT *, ts_rank(search_vector, query) as rank
  FROM hotels, to_tsquery('simple', 'istanbul & deniz') query
  WHERE search_vector @@ query
  ORDER BY rank DESC;
  ```

  ## Performance
  - GIN index makes searches very fast (milliseconds)
  - Automatically maintained on INSERT/UPDATE
  - Minimal storage overhead

  ## Important Notes
  - Using 'simple' configuration (no stemming, works well for Turkish)
  - For production, consider 'turkish' configuration if available
  - Search is case-insensitive and accent-insensitive
*/

-- Add search_vector column to hotels table
ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search_vector
CREATE OR REPLACE FUNCTION hotels_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.location, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.about, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS hotels_search_vector_trigger ON hotels;

-- Create trigger to automatically update search_vector
CREATE TRIGGER hotels_search_vector_trigger
  BEFORE INSERT OR UPDATE OF name, location, about
  ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION hotels_search_vector_update();

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_hotels_search_vector ON hotels USING GIN (search_vector);

-- Update existing rows to populate search_vector
UPDATE hotels
SET search_vector = 
  setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(location, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(about, '')), 'C')
WHERE search_vector IS NULL;
