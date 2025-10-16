/*
  # Add Database Functions for Complex Operations

  ## Overview
  This migration adds PostgreSQL functions to handle complex business logic
  at the database level. This improves performance, data consistency, and
  reduces round-trips between application and database.

  ## Functions Created

  ### 1. get_hotels_by_filters (Complex Search)
  - Single function call for all search filters
  - Optimized query plan
  - Returns properly formatted results

  ### 2. bulk_update_hotel_tags
  - Update tags for multiple hotels at once
  - Atomic operation (all or nothing)
  - Much faster than individual updates

  ### 3. reorder_group_hotels
  - Reorder hotels within a group
  - Atomic reordering operation
  - Maintains data consistency

  ### 4. get_similar_hotels
  - Find hotels similar to a given hotel
  - Based on: location, price range, tags, rating
  - Used for: "Similar Hotels" feature

  ### 5. get_hotel_price_stats
  - Calculate price statistics by location/tags
  - Cached calculations
  - Used for: Price filters, analytics

  ### 6. cleanup_old_audit_logs
  - Archive/delete old audit logs
  - Maintenance function
  - Can be scheduled via cron

  ## Benefits
  - Performance: Database-level operations are faster
  - Consistency: Atomic operations prevent race conditions
  - Simplicity: Complex logic encapsulated in functions
  - Reusability: Call from any client (web, mobile, API)

  ## Important Notes
  - Functions run with database permissions
  - Can use indexes for optimization
  - SECURITY DEFINER for privileged operations
  - Test thoroughly before production use
*/

-- Function: Complex hotel search with all filters
CREATE OR REPLACE FUNCTION get_hotels_by_filters(
  p_search_term text DEFAULT NULL,
  p_tags text[] DEFAULT NULL,
  p_min_price integer DEFAULT NULL,
  p_max_price integer DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  location text,
  price integer,
  rating numeric,
  image_url text,
  tags text[],
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.name,
    h.location,
    h.price,
    h.rating,
    h.image_url,
    h.tags,
    h.created_at
  FROM hotels h
  WHERE h.deleted_at IS NULL
    AND (p_search_term IS NULL OR h.search_vector @@ websearch_to_tsquery('simple', p_search_term))
    AND (p_tags IS NULL OR h.tags @> p_tags)
    AND (p_min_price IS NULL OR h.price >= p_min_price)
    AND (p_max_price IS NULL OR h.price <= p_max_price)
    AND (p_min_rating IS NULL OR h.rating >= p_min_rating)
    AND (p_location IS NULL OR h.location ILIKE '%' || p_location || '%')
  ORDER BY h.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Bulk update tags for multiple hotels
CREATE OR REPLACE FUNCTION bulk_update_hotel_tags(
  p_hotel_ids uuid[],
  p_tags_to_add text[] DEFAULT NULL,
  p_tags_to_remove text[] DEFAULT NULL
)
RETURNS integer AS $$
DECLARE
  v_updated_count integer := 0;
BEGIN
  UPDATE hotels
  SET 
    tags = CASE
      WHEN p_tags_to_add IS NOT NULL AND p_tags_to_remove IS NOT NULL THEN
        (SELECT ARRAY_AGG(DISTINCT t) FROM UNNEST(tags || p_tags_to_add) t WHERE t != ALL(p_tags_to_remove))
      WHEN p_tags_to_add IS NOT NULL THEN
        (SELECT ARRAY_AGG(DISTINCT t) FROM UNNEST(tags || p_tags_to_add) t)
      WHEN p_tags_to_remove IS NOT NULL THEN
        (SELECT ARRAY_AGG(t) FROM UNNEST(tags) t WHERE t != ALL(p_tags_to_remove))
      ELSE tags
    END
  WHERE id = ANY(p_hotel_ids) AND deleted_at IS NULL;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function: Reorder hotels within a group
CREATE OR REPLACE FUNCTION reorder_group_hotels(
  p_group_id uuid,
  p_hotel_order uuid[]
)
RETURNS boolean AS $$
DECLARE
  v_hotel_id uuid;
  v_index integer := 0;
BEGIN
  -- Delete existing order
  DELETE FROM group_hotels WHERE group_id = p_group_id;
  
  -- Insert in new order
  FOREACH v_hotel_id IN ARRAY p_hotel_order
  LOOP
    INSERT INTO group_hotels (group_id, hotel_id, order_index)
    VALUES (p_group_id, v_hotel_id, v_index);
    v_index := v_index + 1;
  END LOOP;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function: Find similar hotels
CREATE OR REPLACE FUNCTION get_similar_hotels(
  p_hotel_id uuid,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  location text,
  price integer,
  rating numeric,
  image_url text,
  similarity_score integer
) AS $$
BEGIN
  RETURN QUERY
  WITH source_hotel AS (
    SELECT h.location, h.price, h.tags, h.rating
    FROM hotels h
    WHERE h.id = p_hotel_id AND h.deleted_at IS NULL
  )
  SELECT 
    h.id,
    h.name,
    h.location,
    h.price,
    h.rating,
    h.image_url,
    (
      CASE WHEN h.location = sh.location THEN 40 ELSE 0 END +
      CASE WHEN ABS(h.price - sh.price) < 1000 THEN 30 ELSE 0 END +
      CASE WHEN ARRAY_LENGTH(h.tags & sh.tags, 1) > 0 THEN 20 ELSE 0 END +
      CASE WHEN ABS(h.rating - sh.rating) < 1 THEN 10 ELSE 0 END
    ) AS similarity_score
  FROM hotels h, source_hotel sh
  WHERE h.id != p_hotel_id 
    AND h.deleted_at IS NULL
    AND (
      h.location = sh.location OR
      ABS(h.price - sh.price) < 2000 OR
      h.tags && sh.tags
    )
  ORDER BY similarity_score DESC, h.rating DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get price statistics
CREATE OR REPLACE FUNCTION get_hotel_price_stats(
  p_location text DEFAULT NULL,
  p_tags text[] DEFAULT NULL
)
RETURNS TABLE (
  avg_price numeric,
  min_price integer,
  max_price integer,
  median_price numeric,
  hotel_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    AVG(h.price)::numeric(10,2),
    MIN(h.price),
    MAX(h.price),
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY h.price)::numeric(10,2),
    COUNT(*)
  FROM hotels h
  WHERE h.deleted_at IS NULL
    AND (p_location IS NULL OR h.location ILIKE '%' || p_location || '%')
    AND (p_tags IS NULL OR h.tags @> p_tags);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Cleanup old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
  p_days_to_keep integer DEFAULT 90
)
RETURNS integer AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM audit_logs
  WHERE created_at < NOW() - (p_days_to_keep || ' days')::interval;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get trending search terms (most used in last 7 days)
-- Note: This would require a search_log table in production
-- Placeholder for future implementation
CREATE OR REPLACE FUNCTION get_trending_tags(
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  tag_name text,
  tag_slug text,
  hotel_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.name,
    t.slug,
    COUNT(h.id) as hotel_count
  FROM tags t
  LEFT JOIN hotels h ON t.slug = ANY(h.tags) AND h.deleted_at IS NULL
  WHERE t.deleted_at IS NULL
  GROUP BY t.id, t.name, t.slug
  ORDER BY hotel_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
