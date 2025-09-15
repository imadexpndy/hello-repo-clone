-- Add new booking statuses for devis flow
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'devis_generated';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'devis_approved';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'payment_sent';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'payment_confirmed';

-- Add teachers_count column to bookings if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS teachers_count INTEGER DEFAULT 0;

-- Add accompagnateurs_count column to bookings if it doesn't exist  
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS accompagnateurs_count INTEGER DEFAULT 0;
