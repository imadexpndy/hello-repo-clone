-- Add all missing columns to bookings table for complete reservation system
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS spectacle_id TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS booking_type TEXT,
ADD COLUMN IF NOT EXISTS number_of_tickets INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
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
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'contact_phone') THEN
        ALTER TABLE bookings RENAME COLUMN contact_phone TO phone;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_spectacle_id ON bookings(spectacle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type ON bookings(booking_type);
