-- Add all ESTEVANICO sessions and mappings
-- Spectacle ID for Estevanico: '550e8400-e29b-41d4-a716-446655440003'

-- Add all sessions for ESTEVANICO (est-1 to est-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- est-1
  ('550e8400-e29b-41d4-a716-9d9160000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-08', '10:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- est-2
  ('550e8400-e29b-41d4-a716-9d9161000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-08', '15:00', 'THEATRE MOHAMMED V', 'Rabat', 400, 400, 80.00, true),
  -- est-3
  ('550e8400-e29b-41d4-a716-9d9162000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-09', '10:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- est-4
  ('550e8400-e29b-41d4-a716-9d9163000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-09', '15:00', 'THEATRE BAHNINI', 'Rabat', 300, 300, 80.00, true),
  -- est-5
  ('550e8400-e29b-41d4-a716-9d9164000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-10', '10:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- est-6
  ('550e8400-e29b-41d4-a716-9d9165000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-10', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 350, 350, 80.00, true),
  -- est-7
  ('550e8400-e29b-41d4-a716-9d9166000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-11', '10:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- est-8
  ('550e8400-e29b-41d4-a716-9d9167000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-11', '15:00', 'THEATRE ATLAS', 'Casablanca', 280, 280, 80.00, true),
  -- est-9
  ('550e8400-e29b-41d4-a716-9d9168000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-12', '10:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true),
  -- est-10
  ('550e8400-e29b-41d4-a716-9d9169000000', '550e8400-e29b-41d4-a716-446655440003', '2025-11-12', '15:00', 'THEATRE NATIONAL', 'Rabat', 500, 500, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- Add session mappings for est-1 to est-10
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  ('est-1', '550e8400-e29b-41d4-a716-9d9160000000'),
  ('est-2', '550e8400-e29b-41d4-a716-9d9161000000'),
  ('est-3', '550e8400-e29b-41d4-a716-9d9162000000'),
  ('est-4', '550e8400-e29b-41d4-a716-9d9163000000'),
  ('est-5', '550e8400-e29b-41d4-a716-9d9164000000'),
  ('est-6', '550e8400-e29b-41d4-a716-9d9165000000'),
  ('est-7', '550e8400-e29b-41d4-a716-9d9166000000'),
  ('est-8', '550e8400-e29b-41d4-a716-9d9167000000'),
  ('est-9', '550e8400-e29b-41d4-a716-9d9168000000'),
  ('est-10', '550e8400-e29b-41d4-a716-9d9169000000')
ON CONFLICT (frontend_id) DO NOTHING;

-- Verify the insertions
SELECT 'Sessions added:' as info, COUNT(*) as count FROM sessions WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440003';
SELECT 'Mappings added:' as info, COUNT(*) as count FROM session_id_mapping WHERE frontend_id LIKE 'est-%';
