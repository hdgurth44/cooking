-- Migration script for user-specific favorites
-- Run this in your Supabase SQL Editor

-- Create user_favorites table
CREATE TABLE user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- Create index for better performance
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_recipe_id ON user_favorites(recipe_id);
CREATE INDEX idx_user_favorites_user_recipe ON user_favorites(user_id, recipe_id);

-- Optional: Enable RLS (Row Level Security) if needed
-- ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Optional: Create RLS policy for user access
-- CREATE POLICY "Users can only access their own favorites" ON user_favorites
-- FOR ALL USING (auth.uid()::text = user_id);