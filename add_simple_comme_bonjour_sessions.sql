-- Add all SIMPLE COMME BONJOUR sessions and mappings
-- Spectacle ID for Simple Comme Bonjour: '550e8400-e29b-41d4-a716-446655440001'

-- Add all sessions for SIMPLE COMME BONJOUR (scb-1 to scb-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- scb-1
  ('550e8400-e29b-41d4-a716-7d7140000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-15', '10:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- scb-2
  ('550e8400-e29b-41d4-a716-7d7141000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-15', '15:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- scb-3
  ('550e8400-e29b-41d4-a716-7d7142000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-16', '10:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- scb-4
  ('550e8400-e29b-41d4-a716-7d7143000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-16', '15:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- scb-5
  ('550e8400-e29b-41d4-a716-7d7144000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-17', '10:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- scb-6
  ('550e8400-e29b-41d4-a716-7d7145000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-17', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- scb-7
  ('550e8400-e29b-41d4-a716-7d7146000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-18', '10:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- scb-8
  ('550e8400-e29b-41d4-a716-7d7147000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-18', '15:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- scb-9
  ('550e8400-e29b-41d4-a716-7d7148000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-19', '10:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true),
  -- scb-10
  ('550e8400-e29b-41d4-a716-7d7149000000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-19', '15:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- Add session mappings for scb-1 to scb-10
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  ('scb-1', '550e8400-e29b-41d4-a716-7d7140000000'),
  ('scb-2', '550e8400-e29b-41d4-a716-7d7141000000'),
  ('scb-3', '550e8400-e29b-41d4-a716-7d7142000000'),
  ('scb-4', '550e8400-e29b-41d4-a716-7d7143000000'),
  ('scb-5', '550e8400-e29b-41d4-a716-7d7144000000'),
  ('scb-6', '550e8400-e29b-41d4-a716-7d7145000000'),
  ('scb-7', '550e8400-e29b-41d4-a716-7d7146000000'),
  ('scb-8', '550e8400-e29b-41d4-a716-7d7147000000'),
  ('scb-9', '550e8400-e29b-41d4-a716-7d7148000000'),
  ('scb-10', '550e8400-e29b-41d4-a716-7d7149000000')
ON CONFLICT (frontend_id) DO NOTHING;

-- Verify the insertions
SELECT 'Sessions added:' as info, COUNT(*) as count FROM sessions WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440001';
SELECT 'Mappings added:' as info, COUNT(*) as count FROM session_id_mapping WHERE frontend_id LIKE 'scb-%';
