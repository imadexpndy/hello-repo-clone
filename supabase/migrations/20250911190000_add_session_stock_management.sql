-- Add session stock management with capacity limits
-- Rabat: 400 for schools/associations, 220 for particuliers
-- Casa: 300 for schools/associations, 220 for particuliers

-- Add capacity fields to sessions table
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT 'Casablanca',
ADD COLUMN IF NOT EXISTS capacity_professional INTEGER NOT NULL DEFAULT 300,
ADD COLUMN IF NOT EXISTS capacity_particulier INTEGER NOT NULL DEFAULT 220,
ADD COLUMN IF NOT EXISTS booked_professional INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS booked_particulier INTEGER NOT NULL DEFAULT 0;

-- Update existing sessions with proper capacities based on city
UPDATE sessions 
SET 
  capacity_professional = CASE 
    WHEN venue LIKE '%Rabat%' OR venue LIKE '%Bahnini%' THEN 400
    ELSE 300
  END,
  capacity_particulier = 220,
  city = CASE 
    WHEN venue LIKE '%Rabat%' OR venue LIKE '%Bahnini%' THEN 'Rabat'
    ELSE 'Casablanca'
  END;

-- Add booking confirmation fields
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS participants_count INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS accompaniers_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS confirmed_by UUID REFERENCES auth.users(id);

-- Function to calculate total attendees for a booking
CREATE OR REPLACE FUNCTION get_booking_total_attendees(booking_row bookings)
RETURNS INTEGER AS $$
BEGIN
  -- For particuliers: count only participants (tickets)
  IF booking_row.booking_type = 'b2c' THEN
    RETURN booking_row.number_of_tickets;
  END IF;
  
  -- For professionals: count participants + accompaniers
  RETURN booking_row.participants_count + booking_row.accompaniers_count;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update session stock when booking is confirmed/cancelled
CREATE OR REPLACE FUNCTION update_session_stock()
RETURNS TRIGGER AS $$
DECLARE
  attendees_count INTEGER;
  is_professional BOOLEAN;
BEGIN
  -- Determine if this is a professional booking
  is_professional := NEW.booking_type IN ('private_school', 'public_school', 'association', 'partner');
  
  -- Calculate attendees count
  attendees_count := get_booking_total_attendees(NEW);
  
  -- Handle confirmation
  IF TG_OP = 'UPDATE' AND OLD.is_confirmed = false AND NEW.is_confirmed = true THEN
    -- Booking was just confirmed - add to stock
    IF is_professional THEN
      UPDATE sessions 
      SET booked_professional = booked_professional + attendees_count
      WHERE id = NEW.session_id;
    ELSE
      UPDATE sessions 
      SET booked_particulier = booked_particulier + attendees_count
      WHERE id = NEW.session_id;
    END IF;
    
  -- Handle unconfirmation/cancellation
  ELSIF TG_OP = 'UPDATE' AND OLD.is_confirmed = true AND NEW.is_confirmed = false THEN
    -- Booking was unconfirmed - remove from stock
    IF is_professional THEN
      UPDATE sessions 
      SET booked_professional = GREATEST(0, booked_professional - attendees_count)
      WHERE id = NEW.session_id;
    ELSE
      UPDATE sessions 
      SET booked_particulier = GREATEST(0, booked_particulier - attendees_count)
      WHERE id = NEW.session_id;
    END IF;
    
  -- Handle deletion of confirmed booking
  ELSIF TG_OP = 'DELETE' AND OLD.is_confirmed = true THEN
    attendees_count := get_booking_total_attendees(OLD);
    is_professional := OLD.booking_type IN ('private_school', 'public_school', 'association', 'partner');
    
    IF is_professional THEN
      UPDATE sessions 
      SET booked_professional = GREATEST(0, booked_professional - attendees_count)
      WHERE id = OLD.session_id;
    ELSE
      UPDATE sessions 
      SET booked_particulier = GREATEST(0, booked_particulier - attendees_count)
      WHERE id = OLD.session_id;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for stock management
DROP TRIGGER IF EXISTS update_session_stock_trigger ON bookings;
CREATE TRIGGER update_session_stock_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_session_stock();

-- Function to check if session has available capacity
CREATE OR REPLACE FUNCTION check_session_capacity(
  p_session_id UUID,
  p_booking_type TEXT,
  p_attendees_count INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  session_record sessions%ROWTYPE;
  is_professional BOOLEAN;
  available_capacity INTEGER;
BEGIN
  -- Get session details
  SELECT * INTO session_record FROM sessions WHERE id = p_session_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Determine if this is a professional booking
  is_professional := p_booking_type IN ('private_school', 'public_school', 'association', 'partner');
  
  -- Check available capacity
  IF is_professional THEN
    available_capacity := session_record.capacity_professional - session_record.booked_professional;
  ELSE
    available_capacity := session_record.capacity_particulier - session_record.booked_particulier;
  END IF;
  
  RETURN available_capacity >= p_attendees_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get session availability info
CREATE OR REPLACE FUNCTION get_session_availability(p_session_id UUID)
RETURNS TABLE(
  session_id UUID,
  city TEXT,
  capacity_professional INTEGER,
  capacity_particulier INTEGER,
  booked_professional INTEGER,
  booked_particulier INTEGER,
  available_professional INTEGER,
  available_particulier INTEGER,
  is_sold_out_professional BOOLEAN,
  is_sold_out_particulier BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.city,
    s.capacity_professional,
    s.capacity_particulier,
    s.booked_professional,
    s.booked_particulier,
    (s.capacity_professional - s.booked_professional) as available_professional,
    (s.capacity_particulier - s.booked_particulier) as available_particulier,
    (s.booked_professional >= s.capacity_professional) as is_sold_out_professional,
    (s.booked_particulier >= s.capacity_particulier) as is_sold_out_particulier
  FROM sessions s
  WHERE s.id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing confirmed bookings to reflect in stock
-- For B2C bookings: confirmed if payment_status = 'completed'
UPDATE bookings 
SET is_confirmed = true, confirmed_at = updated_at
WHERE booking_type = 'b2c' AND payment_status = 'completed';

-- For professional bookings: confirmed if status = 'confirmed'
UPDATE bookings 
SET is_confirmed = true, confirmed_at = updated_at
WHERE booking_type IN ('private_school', 'public_school', 'association', 'partner') 
AND status = 'confirmed';

-- Recalculate current stock based on confirmed bookings
WITH booking_counts AS (
  SELECT 
    session_id,
    SUM(CASE 
      WHEN booking_type = 'b2c' THEN number_of_tickets
      ELSE 0
    END) as total_particulier,
    SUM(CASE 
      WHEN booking_type IN ('private_school', 'public_school', 'association', 'partner') 
      THEN participants_count + accompaniers_count
      ELSE 0
    END) as total_professional
  FROM bookings 
  WHERE is_confirmed = true
  GROUP BY session_id
)
UPDATE sessions 
SET 
  booked_particulier = COALESCE(bc.total_particulier, 0),
  booked_professional = COALESCE(bc.total_professional, 0)
FROM booking_counts bc
WHERE sessions.id = bc.session_id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_session_confirmed ON bookings(session_id, is_confirmed);
CREATE INDEX IF NOT EXISTS idx_bookings_type_confirmed ON bookings(booking_type, is_confirmed);
CREATE INDEX IF NOT EXISTS idx_sessions_city ON sessions(city);
