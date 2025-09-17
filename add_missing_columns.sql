-- Add missing columns to profiles table for enhanced user management
-- Execute this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
