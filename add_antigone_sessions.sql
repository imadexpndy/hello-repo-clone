-- Add all ANTIGONE sessions and mappings
-- Spectacle ID for Antigone: '550e8400-e29b-41d4-a716-446655440005'

-- Add all sessions for ANTIGONE (ant-1 to ant-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- ant-1
  ('550e8400-e29b-41d4-a716-bdb180000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-22', '10:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- ant-2
  ('550e8400-e29b-41d4-a716-bdb181000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-22', '15:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- ant-3
  ('550e8400-e29b-41d4-a716-bdb182000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-23', '10:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- ant-4
  ('550e8400-e29b-41d4-a716-bdb183000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-23', '15:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- ant-5
  ('550e8400-e29b-41d4-a716-bdb184000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-24', '10:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- ant-6
  ('550e8400-e29b-41d4-a716-bdb185000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-24', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- ant-7
  ('550e8400-e29b-41d4-a716-bdb186000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-25', '10:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- ant-8
  ('550e8400-e29b-41d4-a716-bdb187000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-25', '15:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- ant-9
  ('550e8400-e29b-41d4-a716-bdb188000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-26', '10:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true),
  -- ant-10
  ('550e8400-e29b-41d4-a716-bdb189000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-26', '15:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- Add session mappings for ant-1 to ant-10
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  ('ant-1', '550e8400-e29b-41d4-a716-bdb180000000'),
  ('ant-2', '550e8400-e29b-41d4-a716-bdb181000000'),
  ('ant-3', '550e8400-e29b-41d4-a716-bdb182000000'),
  ('ant-4', '550e8400-e29b-41d4-a716-bdb183000000'),
  ('ant-5', '550e8400-e29b-41d4-a716-bdb184000000'),
  ('ant-6', '550e8400-e29b-41d4-a716-bdb185000000'),
  ('ant-7', '550e8400-e29b-41d4-a716-bdb186000000'),
  ('ant-8', '550e8400-e29b-41d4-a716-bdb187000000'),
  ('ant-9', '550e8400-e29b-41d4-a716-bdb188000000'),
  ('ant-10', '550e8400-e29b-41d4-a716-bdb189000000')
ON CONFLICT (frontend_id) DO NOTHING;

-- Verify the insertions
SELECT 'Sessions added:' as info, COUNT(*) as count FROM sessions WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440005';
SELECT 'Mappings added:' as info, COUNT(*) as count FROM session_id_mapping WHERE frontend_id LIKE 'ant-%';
