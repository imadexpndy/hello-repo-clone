-- Add all FLASH sessions and mappings
-- Spectacle ID for Flash: '550e8400-e29b-41d4-a716-446655440004'

-- Add all sessions for FLASH (flash-1 to flash-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- flash-1
  ('550e8400-e29b-41d4-a716-ada170000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-15', '10:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- flash-2
  ('550e8400-e29b-41d4-a716-ada171000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-15', '15:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- flash-3
  ('550e8400-e29b-41d4-a716-ada172000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-16', '10:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- flash-4
  ('550e8400-e29b-41d4-a716-ada173000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-16', '15:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- flash-5
  ('550e8400-e29b-41d4-a716-ada174000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-17', '10:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- flash-6
  ('550e8400-e29b-41d4-a716-ada175000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-17', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- flash-7
  ('550e8400-e29b-41d4-a716-ada176000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-18', '10:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- flash-8
  ('550e8400-e29b-41d4-a716-ada177000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-18', '15:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- flash-9
  ('550e8400-e29b-41d4-a716-ada178000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-19', '10:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true),
  -- flash-10
  ('550e8400-e29b-41d4-a716-ada179000000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-19', '15:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- Add session mappings for flash-1 to flash-10
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  ('flash-1', '550e8400-e29b-41d4-a716-ada170000000'),
  ('flash-2', '550e8400-e29b-41d4-a716-ada171000000'),
  ('flash-3', '550e8400-e29b-41d4-a716-ada172000000'),
  ('flash-4', '550e8400-e29b-41d4-a716-ada173000000'),
  ('flash-5', '550e8400-e29b-41d4-a716-ada174000000'),
  ('flash-6', '550e8400-e29b-41d4-a716-ada175000000'),
  ('flash-7', '550e8400-e29b-41d4-a716-ada176000000'),
  ('flash-8', '550e8400-e29b-41d4-a716-ada177000000'),
  ('flash-9', '550e8400-e29b-41d4-a716-ada178000000'),
  ('flash-10', '550e8400-e29b-41d4-a716-ada179000000')
ON CONFLICT (frontend_id) DO NOTHING;

-- Verify the insertions
SELECT 'Sessions added:' as info, COUNT(*) as count FROM sessions WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440004';
SELECT 'Mappings added:' as info, COUNT(*) as count FROM session_id_mapping WHERE frontend_id LIKE 'flash-%';
