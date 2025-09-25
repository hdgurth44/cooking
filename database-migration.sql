-- Migration: Add user_id support for user-specific recipes
-- Run this in your Supabase SQL Editor

-- 1. Add user_id column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 2. Assign all existing recipes to the admin user (making them shared)
UPDATE recipes
SET user_id = 'user_33A5bJH53B8avmfLhp5tCMEHweN'
WHERE user_id IS NULL;

-- 3. Create index for performance
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);

-- 4. Verify the migration
SELECT
  COUNT(*) as total_recipes,
  COUNT(CASE WHEN user_id = 'user_33A5bJH53B8avmfLhp5tCMEHweN' THEN 1 END) as admin_recipes,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as recipes_without_user
FROM recipes;