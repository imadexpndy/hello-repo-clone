-- Add missing teachers_count column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS teachers_count INTEGER DEFAULT 0;

-- Add accompagnateurs_count column if it doesn't exist  
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS accompagnateurs_count INTEGER DEFAULT 0;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('teachers_count', 'accompagnateurs_count');
