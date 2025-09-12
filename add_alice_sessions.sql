-- Add all ALICE CHEZ LES MERVEILLES sessions and mappings
-- Spectacle ID for Alice Chez Les Merveilles: '550e8400-e29b-41d4-a716-446655440006'

-- Add all sessions for ALICE CHEZ LES MERVEILLES (ali-1 to ali-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- ali-1
  ('550e8400-e29b-41d4-a716-cdc190000000', '550e8400-e29b-41d4-a716-446655440006', '2025-11-29', '10:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- ali-2
  ('550e8400-e29b-41d4-a716-cdc191000000', '550e8400-e29b-41d4-a716-446655440006', '2025-11-29', '15:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- ali-3
  ('550e8400-e29b-41d4-a716-cdc192000000', '550e8400-e29b-41d4-a716-446655440006', '2025-11-30', '10:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- ali-4
  ('550e8400-e29b-41d4-a716-cdc193000000', '550e8400-e29b-41d4-a716-446655440006', '2025-11-30', '15:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- ali-5
  ('550e8400-e29b-41d4-a716-cdc194000000', '550e8400-e29b-41d4-a716-446655440006', '2025-12-01', '10:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- ali-6
  ('550e8400-e29b-41d4-a716-cdc195000000', '550e8400-e29b-41d4-a716-446655440006', '2025-12-01', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- ali-7
  ('550e8400-e29b-41d4-a716-cdc196000000', '550e8400-e29b-41d4-a716-446655440006', '2025-12-02', '10:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- ali-8
  ('550e8400-e29b-41d4-a716-cdc197000000', '550e8400-e29b-41d4-a716-446655440006', '2025-12-02', '15:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- ali-9
  ('550e8400-e29b-41d4-a716-cdc198000000', '550e8400-e29b-41d4-a716-446655440006', '2025-12-03', '10:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true),
  -- ali-10
  ('550e8400-e29b-41d4-a716-cdc199000000', '550e8400-e29b-41d4-a716-446655440006', '2025-12-03', '15:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- Add session mappings for ali-1 to ali-10
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  ('ali-1', '550e8400-e29b-41d4-a716-cdc190000000'),
  ('ali-2', '550e8400-e29b-41d4-a716-cdc191000000'),
  ('ali-3', '550e8400-e29b-41d4-a716-cdc192000000'),
  ('ali-4', '550e8400-e29b-41d4-a716-cdc193000000'),
  ('ali-5', '550e8400-e29b-41d4-a716-cdc194000000'),
  ('ali-6', '550e8400-e29b-41d4-a716-cdc195000000'),
  ('ali-7', '550e8400-e29b-41d4-a716-cdc196000000'),
  ('ali-8', '550e8400-e29b-41d4-a716-cdc197000000'),
  ('ali-9', '550e8400-e29b-41d4-a716-cdc198000000'),
  ('ali-10', '550e8400-e29b-41d4-a716-cdc199000000')
ON CONFLICT (frontend_id) DO NOTHING;

-- Verify the insertions
SELECT 'Sessions added:' as info, COUNT(*) as count FROM sessions WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440006';
SELECT 'Mappings added:' as info, COUNT(*) as count FROM session_id_mapping WHERE frontend_id LIKE 'ali-%';
