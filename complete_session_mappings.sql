-- Complete session mappings for ALL spectacles and user types
-- This ensures reservation system works for all 11 spectacles and 4 user types

-- First, get spectacle IDs we need
-- le-petit-prince: 550e8400-e29b-41d4-a716-446655440000
-- le-petit-prince-ar: 550e8400-e29b-41d4-a716-446655440001  
-- tara-sur-la-lune: 550e8400-e29b-41d4-a716-446655440002
-- leau-la: 550e8400-e29b-41d4-a716-446655440003
-- mirath-atfal: 1301608b-652a-4dde-9ddc-c0038b368448
-- simple-comme-bonjour: 6d9eddf3-0be0-442f-9594-8b8c2a1977ca
-- charlotte: 550e8400-e29b-41d4-a716-446655440006
-- estevanico: 550e8400-e29b-41d4-a716-446655440007
-- flash: 550e8400-e29b-41d4-a716-446655440008
-- antigone: 550e8400-e29b-41d4-a716-446655440009
-- alice-chez-les-merveilles: 550e8400-e29b-41d4-a716-446655440010

-- TARA SUR LA LUNE sessions (tsl-1 to tsl-8)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active) VALUES
('c1d2e3f4-a5b6-7890-cdef-a12345678901', '550e8400-e29b-41d4-a716-446655440002', '2025-10-11', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678902', '550e8400-e29b-41d4-a716-446655440002', '2025-10-09', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678903', '550e8400-e29b-41d4-a716-446655440002', '2025-10-09', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 80.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678904', '550e8400-e29b-41d4-a716-446655440002', '2025-10-10', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 80.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678905', '550e8400-e29b-41d4-a716-446655440002', '2025-10-18', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678906', '550e8400-e29b-41d4-a716-446655440002', '2025-10-13', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 100.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678907', '550e8400-e29b-41d4-a716-446655440002', '2025-10-14', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 80.00, true),
('c1d2e3f4-a5b6-7890-cdef-a12345678908', '550e8400-e29b-41d4-a716-446655440002', '2025-10-14', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- TARA SUR LA LUNE mappings
INSERT INTO public.session_id_mapping (frontend_id, database_uuid) VALUES
('tsl-1', 'c1d2e3f4-a5b6-7890-cdef-a12345678901'),
('tsl-2', 'c1d2e3f4-a5b6-7890-cdef-a12345678902'),
('tsl-3', 'c1d2e3f4-a5b6-7890-cdef-a12345678903'),
('tsl-4', 'c1d2e3f4-a5b6-7890-cdef-a12345678904'),
('tsl-5', 'c1d2e3f4-a5b6-7890-cdef-a12345678905'),
('tsl-6', 'c1d2e3f4-a5b6-7890-cdef-a12345678906'),
('tsl-7', 'c1d2e3f4-a5b6-7890-cdef-a12345678907'),
('tsl-8', 'c1d2e3f4-a5b6-7890-cdef-a12345678908')
ON CONFLICT (frontend_id) DO NOTHING;
