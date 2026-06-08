-- Migration to add visual reference IDs
ALTER TABLE products ADD COLUMN reference_id TEXT;
ALTER TABLE users ADD COLUMN reference_id TEXT;
ALTER TABLE tenders ADD COLUMN reference_id TEXT;
ALTER TABLE companies ADD COLUMN reference_id TEXT;
