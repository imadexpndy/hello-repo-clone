-- Add canonical session_uuid and session_frontend_id, set defaults, backfill, and create RPC for safe booking inserts

-- 1) Columns for canonical UUID and frontend id
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS session_uuid uuid,
  ADD COLUMN IF NOT EXISTS session_frontend_id text,
  ALTER COLUMN booking_type SET DEFAULT 'particulier';

-- 2) Mirror existing session_id (TEXT) to session_frontend_id if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'session_id'
  ) THEN
    UPDATE bookings 
    SET session_frontend_id = session_id
    WHERE session_frontend_id IS NULL AND session_id IS NOT NULL;
  END IF;
END $$;

-- 3) Backfill session_uuid using mapping table
-- Expecting: session_id_mapping(frontend_id text unique, database_uuid uuid)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'session_uuid'
  ) THEN
    UPDATE bookings b
    SET session_uuid = m.database_uuid
    FROM session_id_mapping m
    WHERE b.session_uuid IS NULL
      AND (
        (b.session_frontend_id IS NOT NULL AND m.frontend_id = b.session_frontend_id)
        OR
        (b.session_frontend_id IS NULL AND b.session_id IS NOT NULL AND m.frontend_id = b.session_id::text)
      );
  END IF;
END $$;

-- 4) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_bookings_session_uuid ON bookings(session_uuid);
CREATE INDEX IF NOT EXISTS idx_bookings_session_frontend_id ON bookings(session_frontend_id);

-- 5) RPC to create booking by frontend session id, mapping to session UUID server-side
CREATE OR REPLACE FUNCTION public.create_booking_by_frontend_id(
  p_frontend_session_id text,
  p_spectacle_id text,
  p_booking_type text DEFAULT 'particulier',
  p_number_of_tickets integer DEFAULT 1,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_whatsapp text DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_payment_method text DEFAULT NULL,
  p_total_amount numeric DEFAULT NULL,
  p_payment_reference text DEFAULT NULL
) RETURNS bookings AS $$
DECLARE
  v_session_uuid uuid;
  v_user_id uuid;
  v_row bookings;
BEGIN
  -- Map frontend session id -> session UUID
  SELECT database_uuid INTO v_session_uuid
  FROM session_id_mapping
  WHERE frontend_id = p_frontend_session_id;

  IF v_session_uuid IS NULL THEN
    RAISE EXCEPTION 'Session mapping not found for frontend id: %', p_frontend_session_id;
  END IF;

  -- RLS expects auth.uid() = user_id
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO bookings (
    user_id,
    spectacle_id,
    session_id,
    session_uuid,
    session_frontend_id,
    booking_type,
    number_of_tickets,
    first_name,
    last_name,
    email,
    phone,
    whatsapp,
    notes,
    payment_method,
    total_amount,
    payment_reference
  ) VALUES (
    v_user_id,
    p_spectacle_id,
    v_session_uuid,
    v_session_uuid,
    p_frontend_session_id,
    COALESCE(NULLIF(p_booking_type, ''), 'particulier'),
    COALESCE(p_number_of_tickets, 1),
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_whatsapp,
    p_notes,
    p_payment_method,
    p_total_amount,
    p_payment_reference
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE ALL ON FUNCTION public.create_booking_by_frontend_id FROM public;
GRANT EXECUTE ON FUNCTION public.create_booking_by_frontend_id TO authenticated;
