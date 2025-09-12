-- Fix backup restoration by dropping backup and recreating bookings table cleanly
-- This avoids schema mismatch issues

-- Drop backup table if it exists
DROP TABLE IF EXISTS bookings_backup CASCADE;

-- Drop the existing bookings table completely
DROP TABLE IF EXISTS bookings CASCADE;

-- Recreate bookings table with correct schema (no backup restoration)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    spectacle_id TEXT,
    session_id TEXT,  -- TEXT type to accept "lpp-1" format
    booking_type TEXT,
    number_of_tickets INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2) DEFAULT 0,
    payment_method TEXT,
    payment_reference TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional columns from original schema
    student_count INTEGER DEFAULT 1,
    teacher_count INTEGER DEFAULT 1,
    grade_level TEXT,
    school_address TEXT,
    special_requirements TEXT,
    quote_pdf_url TEXT,
    quote_generated_at TIMESTAMPTZ,
    accompanists_count INTEGER,
    confirmation_deadline TIMESTAMPTZ,
    devis_url TEXT
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_spectacle_id ON bookings(spectacle_id);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_booking_type ON bookings(booking_type);
CREATE INDEX idx_bookings_status ON bookings(status);
