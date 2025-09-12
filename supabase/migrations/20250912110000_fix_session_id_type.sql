-- Fix session_id column type in bookings table
-- Change from UUID to TEXT to support frontend session IDs like 'lpp-1'

-- First, check if session_id column exists and what type it is
DO $$
BEGIN
    -- If session_id exists as UUID, change it to TEXT
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'session_id' 
        AND data_type = 'uuid'
    ) THEN
        -- Drop foreign key constraint if it exists
        ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_session_id_fkey;
        
        -- Change column type from UUID to TEXT
        ALTER TABLE bookings ALTER COLUMN session_id TYPE TEXT;
        
        RAISE NOTICE 'Changed session_id from UUID to TEXT';
    END IF;
    
    -- Ensure session_id column exists as TEXT
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'session_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN session_id TEXT;
        RAISE NOTICE 'Added session_id column as TEXT';
    END IF;
END $$;
