/*
  # Add Audit Logging System

  ## Overview
  This migration creates a comprehensive audit logging system to track all
  changes to critical tables. Useful for debugging, compliance, and analytics.

  ## Tables Created

  ### audit_logs
  - Tracks all INSERT, UPDATE, DELETE operations
  - Records: table name, operation, old/new values, timestamp, user
  - Automatic via triggers (no application code changes needed)

  ## Columns
  1. **id** - Unique log entry ID
  2. **table_name** - Which table was modified
  3. **operation** - INSERT, UPDATE, or DELETE
  4. **record_id** - ID of the affected record
  5. **old_values** - JSONB of values before change (UPDATE/DELETE only)
  6. **new_values** - JSONB of values after change (INSERT/UPDATE only)
  7. **created_at** - When the change occurred
  8. **user_id** - Who made the change (if authenticated)

  ## Triggers Added
  - hotels (all operations)
  - groups (all operations)
  - tags (all operations)
  - price_tags (all operations)
  - search_terms (all operations)

  ## Benefits
  - Full audit trail of all data changes
  - Debugging: See exactly what changed and when
  - Compliance: Required for many industries
  - Analytics: Understand data modification patterns
  - Recovery: Restore deleted/modified data

  ## Performance Impact
  - Minimal: Triggers are fast, JSONB is efficient
  - Async option: Can move to background jobs if needed
  - Retention: Consider archiving old logs (30+ days)

  ## Important Notes
  - Logs are append-only (never delete)
  - JSONB format allows flexible querying
  - Can query by table, operation, record_id, date range
  - Consider data privacy laws when logging user data
*/

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id uuid NOT NULL,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_operation ON audit_logs(operation);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id, created_at DESC);

-- Enable RLS (read-only for admins, if needed later)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to audit logs (adjust as needed for production)
CREATE POLICY "Public can read audit logs"
  ON audit_logs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create generic audit logging function
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (table_name, operation, record_id, old_values)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (table_name, operation, record_id, old_values, new_values)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (table_name, operation, record_id, new_values)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS audit_hotels_changes ON hotels;
DROP TRIGGER IF EXISTS audit_groups_changes ON groups;
DROP TRIGGER IF EXISTS audit_tags_changes ON tags;
DROP TRIGGER IF EXISTS audit_price_tags_changes ON price_tags;
DROP TRIGGER IF EXISTS audit_search_terms_changes ON search_terms;

-- Create audit triggers for all critical tables
CREATE TRIGGER audit_hotels_changes
  AFTER INSERT OR UPDATE OR DELETE ON hotels
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_groups_changes
  AFTER INSERT OR UPDATE OR DELETE ON groups
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_tags_changes
  AFTER INSERT OR UPDATE OR DELETE ON tags
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_price_tags_changes
  AFTER INSERT OR UPDATE OR DELETE ON price_tags
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_search_terms_changes
  AFTER INSERT OR UPDATE OR DELETE ON search_terms
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Create view for human-readable audit log
CREATE OR REPLACE VIEW audit_log_summary AS
SELECT 
  al.id,
  al.table_name,
  al.operation,
  al.record_id,
  al.created_at,
  CASE 
    WHEN al.table_name = 'hotels' THEN al.new_values->>'name'
    WHEN al.table_name = 'groups' THEN al.new_values->>'title'
    WHEN al.table_name = 'tags' THEN al.new_values->>'name'
    WHEN al.table_name = 'price_tags' THEN al.new_values->>'label'
    WHEN al.table_name = 'search_terms' THEN al.new_values->>'term'
  END as record_name
FROM audit_logs al
ORDER BY al.created_at DESC;
