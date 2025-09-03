-- Update bookings table for teacher booking system
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS teacher_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS school_address TEXT,
ADD COLUMN IF NOT EXISTS special_requirements TEXT,
ADD COLUMN IF NOT EXISTS quote_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS quote_generated_at TIMESTAMPTZ;

-- Update spectacles table to include missing fields
ALTER TABLE spectacles 
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS price_school DECIMAL(10,2) DEFAULT 0;

-- Create spectacle_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS spectacle_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spectacle_id UUID REFERENCES spectacles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue TEXT,
    max_capacity INTEGER DEFAULT 100,
    available_spots INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for quotes if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotes', 'quotes', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for quotes bucket
CREATE POLICY IF NOT EXISTS "Users can view their own quotes"
ON storage.objects FOR SELECT
USING (bucket_id = 'quotes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "System can upload quotes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quotes');

-- Update RLS policies for bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
CREATE POLICY "Users can create their own bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
CREATE POLICY "Users can update their own bookings"
ON bookings FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for spectacle_sessions
ALTER TABLE spectacle_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Everyone can view spectacle sessions"
ON spectacle_sessions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage spectacle sessions"
ON spectacle_sessions FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role LIKE '%admin%'
    )
);

-- Update trigger for spectacle_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_spectacle_sessions_updated_at ON spectacle_sessions;
CREATE TRIGGER update_spectacle_sessions_updated_at
    BEFORE UPDATE ON spectacle_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
