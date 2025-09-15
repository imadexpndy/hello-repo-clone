-- Add missing columns to bookings table for private school flow
-- Run this in your Supabase SQL Editor

-- Add teachers_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'teachers_count') THEN
        ALTER TABLE bookings ADD COLUMN teachers_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add accompagnateurs_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'accompagnateurs_count') THEN
        ALTER TABLE bookings ADD COLUMN accompagnateurs_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('teachers_count', 'accompagnateurs_count', 'teacher_count', 'student_count', 'students_count')
ORDER BY column_name;
