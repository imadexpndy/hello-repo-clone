-- Add all CHARLOTTE sessions and mappings
-- Spectacle ID for Charlotte: '550e8400-e29b-41d4-a716-446655440002'

-- Add all sessions for CHARLOTTE (cha-1 to cha-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- cha-1
  ('550e8400-e29b-41d4-a716-8d8150000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-01', '10:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- cha-2
  ('550e8400-e29b-41d4-a716-8d8151000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-01', '15:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- cha-3
  ('550e8400-e29b-41d4-a716-8d8152000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-02', '10:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- cha-4
  ('550e8400-e29b-41d4-a716-8d8153000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-02', '15:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- cha-5
  ('550e8400-e29b-41d4-a716-8d8154000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-03', '10:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- cha-6
  ('550e8400-e29b-41d4-a716-8d8155000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-03', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- cha-7
  ('550e8400-e29b-41d4-a716-8d8156000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-04', '10:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- cha-8
  ('550e8400-e29b-41d4-a716-8d8157000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-04', '15:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- cha-9
  ('550e8400-e29b-41d4-a716-8d8158000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-05', '10:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true),
  -- cha-10
  ('550e8400-e29b-41d4-a716-8d8159000000', '550e8400-e29b-41d4-a716-446655440002', '2025-11-05', '15:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- Add session mappings for cha-1 to cha-10
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  ('cha-1', '550e8400-e29b-41d4-a716-8d8150000000'),
  ('cha-2', '550e8400-e29b-41d4-a716-8d8151000000'),
  ('cha-3', '550e8400-e29b-41d4-a716-8d8152000000'),
  ('cha-4', '550e8400-e29b-41d4-a716-8d8153000000'),
  ('cha-5', '550e8400-e29b-41d4-a716-8d8154000000'),
  ('cha-6', '550e8400-e29b-41d4-a716-8d8155000000'),
  ('cha-7', '550e8400-e29b-41d4-a716-8d8156000000'),
  ('cha-8', '550e8400-e29b-41d4-a716-8d8157000000'),
  ('cha-9', '550e8400-e29b-41d4-a716-8d8158000000'),
  ('cha-10', '550e8400-e29b-41d4-a716-8d8159000000')
ON CONFLICT (frontend_id) DO NOTHING;

-- Verify the insertions
SELECT 'Sessions added:' as info, COUNT(*) as count FROM sessions WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440002';
SELECT 'Mappings added:' as info, COUNT(*) as count FROM session_id_mapping WHERE frontend_id LIKE 'cha-%';
