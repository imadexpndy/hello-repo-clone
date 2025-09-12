-- Add missing columns to bookings table for reservation system
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS spectacle_id TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS booking_type TEXT,
ADD COLUMN IF NOT EXISTS number_of_tickets INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing columns if they exist with different names
DO $$
BEGIN
    -- Check if old column names exist and rename them
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'number_of_seats') THEN
        ALTER TABLE bookings RENAME COLUMN number_of_seats TO number_of_tickets;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'total_price') THEN
        ALTER TABLE bookings RENAME COLUMN total_price TO total_amount;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_spectacle_id ON bookings(spectacle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
