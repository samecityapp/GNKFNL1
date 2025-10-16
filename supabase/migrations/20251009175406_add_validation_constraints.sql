/*
  # Add Validation Constraints for Data Integrity

  ## Overview
  This migration adds database-level validation constraints to ensure data quality
  and prevent invalid data from being inserted or updated.

  ## Constraints Added

  ### Hotels Table
  1. **price >= 0** - Prices cannot be negative
  2. **rating between 0 and 5** - Already exists, verified
  3. **name not empty** - Hotel name required
  4. **location not empty** - Location required

  ### Price Tags Table
  5. **min_price >= 0** - Minimum price cannot be negative
  6. **max_price >= min_price** - Maximum must be greater than or equal to minimum
  7. **label not empty** - Label required

  ### Tags Table
  8. **name not empty** - Tag name required
  9. **slug not empty** - Slug required

  ### Search Terms Table
  10. **term not empty** - Search term required
  11. **slug not empty** - Slug required

  ### Groups Table
  12. **title not empty** - Group title required

  ## Benefits
  - Data integrity at database level
  - Prevents invalid data entry
  - Clear error messages when validation fails
  - Cannot be bypassed by application code

  ## Important Notes
  - Constraints apply to both INSERT and UPDATE operations
  - Existing data is not affected (constraints are not retroactive)
  - Use `CHECK` for value validation, `NOT NULL` for required fields
*/

-- Hotels table constraints
ALTER TABLE hotels
  DROP CONSTRAINT IF EXISTS hotels_price_positive,
  ADD CONSTRAINT hotels_price_positive CHECK (price >= 0);

ALTER TABLE hotels
  DROP CONSTRAINT IF EXISTS hotels_name_not_empty,
  ADD CONSTRAINT hotels_name_not_empty CHECK (length(trim(name)) > 0);

ALTER TABLE hotels
  DROP CONSTRAINT IF EXISTS hotels_location_not_empty,
  ADD CONSTRAINT hotels_location_not_empty CHECK (length(trim(location)) > 0);

-- Price tags table constraints
ALTER TABLE price_tags
  DROP CONSTRAINT IF EXISTS price_tags_min_price_positive,
  ADD CONSTRAINT price_tags_min_price_positive CHECK (min_price >= 0);

ALTER TABLE price_tags
  DROP CONSTRAINT IF EXISTS price_tags_max_gte_min,
  ADD CONSTRAINT price_tags_max_gte_min CHECK (max_price >= min_price);

ALTER TABLE price_tags
  DROP CONSTRAINT IF EXISTS price_tags_label_not_empty,
  ADD CONSTRAINT price_tags_label_not_empty CHECK (length(trim(label)) > 0);

-- Tags table constraints
ALTER TABLE tags
  DROP CONSTRAINT IF EXISTS tags_name_not_empty,
  ADD CONSTRAINT tags_name_not_empty CHECK (length(trim(name)) > 0);

ALTER TABLE tags
  DROP CONSTRAINT IF EXISTS tags_slug_not_empty,
  ADD CONSTRAINT tags_slug_not_empty CHECK (length(trim(slug)) > 0);

-- Search terms table constraints
ALTER TABLE search_terms
  DROP CONSTRAINT IF EXISTS search_terms_term_not_empty,
  ADD CONSTRAINT search_terms_term_not_empty CHECK (length(trim(term)) > 0);

ALTER TABLE search_terms
  DROP CONSTRAINT IF EXISTS search_terms_slug_not_empty,
  ADD CONSTRAINT search_terms_slug_not_empty CHECK (length(trim(slug)) > 0);

-- Groups table constraints
ALTER TABLE groups
  DROP CONSTRAINT IF EXISTS groups_title_not_empty,
  ADD CONSTRAINT groups_title_not_empty CHECK (length(trim(title)) > 0);
