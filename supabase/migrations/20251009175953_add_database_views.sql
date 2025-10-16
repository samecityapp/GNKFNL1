/*
  # Add Database Views for Common Queries

  ## Overview
  Views simplify complex queries and provide consistent data access patterns.
  They also improve performance by pre-defining optimal query paths.

  ## Views Created

  ### 1. active_hotels
  - Shows only non-deleted hotels with all fields
  - Eliminates need to always check deleted_at IS NULL
  - Used by: All frontend hotel queries

  ### 2. published_groups_with_hotels
  - Shows published groups with their associated hotel IDs
  - Pre-joins groups and group_hotels tables
  - Used by: Homepage group displays

  ### 3. featured_tags
  - Shows only featured, non-deleted tags
  - Used by: Homepage tag display

  ### 4. hotel_search_summary
  - Optimized view for search results
  - Only includes essential fields (faster queries)
  - Pre-filters deleted hotels

  ### 5. hotel_statistics
  - Aggregate statistics about hotels
  - Count by location, average price, rating distribution
  - Used by: Admin dashboards, analytics

  ## Benefits
  - Code simplification: SELECT * FROM active_hotels instead of complex WHERE clauses
  - Performance: Views are optimized by query planner
  - Consistency: Same query logic everywhere
  - Security: Can restrict columns shown in views
  - Maintainability: Change view definition once, affects all usage

  ## Important Notes
  - Views are virtual tables (no storage overhead)
  - Views automatically reflect underlying table changes
  - Can be indexed for better performance (materialized views)
  - RLS policies still apply on underlying tables
*/

-- View: Active (non-deleted) hotels
CREATE OR REPLACE VIEW active_hotels AS
SELECT 
  id,
  name,
  location,
  description,
  price,
  rating,
  image_url,
  amenities,
  tags,
  about,
  about_facility,
  rules,
  video_url,
  gallery_images,
  latitude,
  longitude,
  created_at,
  updated_at
FROM hotels
WHERE deleted_at IS NULL;

-- View: Published groups with their hotel count
CREATE OR REPLACE VIEW published_groups_with_hotels AS
SELECT 
  g.id,
  g.title,
  g.created_at,
  g.updated_at,
  COUNT(gh.hotel_id) as hotel_count,
  ARRAY_AGG(gh.hotel_id ORDER BY gh.order_index) as hotel_ids
FROM groups g
LEFT JOIN group_hotels gh ON g.id = gh.group_id
WHERE g.is_published = true AND g.deleted_at IS NULL
GROUP BY g.id, g.title, g.created_at, g.updated_at;

-- View: Featured tags only
CREATE OR REPLACE VIEW featured_tags AS
SELECT 
  id,
  name,
  slug,
  icon,
  created_at
FROM tags
WHERE is_featured = true AND deleted_at IS NULL
ORDER BY name;

-- View: Hotel search summary (lightweight for list views)
CREATE OR REPLACE VIEW hotel_search_summary AS
SELECT 
  id,
  name,
  location,
  price,
  rating,
  image_url,
  tags,
  created_at
FROM hotels
WHERE deleted_at IS NULL;

-- View: Hotel statistics by location
CREATE OR REPLACE VIEW hotel_location_stats AS
SELECT 
  location,
  COUNT(*) as hotel_count,
  AVG(price)::integer as avg_price,
  AVG(rating)::numeric(3,2) as avg_rating,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM hotels
WHERE deleted_at IS NULL
GROUP BY location
ORDER BY hotel_count DESC;

-- View: Price range distribution
CREATE OR REPLACE VIEW price_range_distribution AS
SELECT 
  pt.label,
  pt.min_price,
  pt.max_price,
  COUNT(h.id) as hotel_count
FROM price_tags pt
LEFT JOIN hotels h ON h.price BETWEEN pt.min_price AND pt.max_price
  AND h.deleted_at IS NULL
WHERE pt.deleted_at IS NULL
GROUP BY pt.id, pt.label, pt.min_price, pt.max_price
ORDER BY pt.min_price;

-- View: Tag usage statistics
CREATE OR REPLACE VIEW tag_usage_stats AS
SELECT 
  t.id,
  t.name,
  t.slug,
  t.is_featured,
  COUNT(h.id) as hotel_count
FROM tags t
LEFT JOIN hotels h ON t.slug = ANY(h.tags)
  AND h.deleted_at IS NULL
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.name, t.slug, t.is_featured
ORDER BY hotel_count DESC;
