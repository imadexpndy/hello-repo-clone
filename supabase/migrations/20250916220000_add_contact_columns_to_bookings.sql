-- Add missing contact columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS children_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accompanists_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS teachers_count INTEGER DEFAULT 0;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_bookings_contact_email ON bookings(contact_email);
CREATE INDEX IF NOT EXISTS idx_bookings_contact_name ON bookings(contact_name);
