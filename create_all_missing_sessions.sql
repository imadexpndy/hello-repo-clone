-- Create ALL missing sessions and mappings for universal reservation system
-- This ensures ALL 11 spectacles work with ALL 4 user types

-- LE PETIT PRINCE sessions (lpp-1 to lpp-10)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active) VALUES
('d1e2f3g4-b5c6-7890-defg-b12345678901', '550e8400-e29b-41d4-a716-446655440000', '2025-10-04', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678902', '550e8400-e29b-41d4-a716-446655440000', '2025-10-06', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678903', '550e8400-e29b-41d4-a716-446655440000', '2025-10-06', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678904', '550e8400-e29b-41d4-a716-446655440000', '2025-10-07', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 80.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678905', '550e8400-e29b-41d4-a716-446655440000', '2025-10-07', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 80.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678906', '550e8400-e29b-41d4-a716-446655440000', '2025-10-09', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 80.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678907', '550e8400-e29b-41d4-a716-446655440000', '2025-10-09', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 80.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678908', '550e8400-e29b-41d4-a716-446655440000', '2025-10-10', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 100.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678909', '550e8400-e29b-41d4-a716-446655440000', '2025-10-10', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 100.00, true),
('d1e2f3g4-b5c6-7890-defg-b12345678910', '550e8400-e29b-41d4-a716-446655440000', '2025-10-11', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- LE PETIT PRINCE AR sessions (lpp-ar-1 to lpp-ar-2)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active) VALUES
('e1f2g3h4-c5d6-7890-efgh-c12345678901', '550e8400-e29b-41d4-a716-446655440001', '2025-10-05', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
('e1f2g3h4-c5d6-7890-efgh-c12345678902', '550e8400-e29b-41d4-a716-446655440001', '2025-10-12', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true)
ON CONFLICT (id) DO NOTHING;

-- L'EAU LA sessions (leau-1 to leau-13)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active) VALUES
('f1g2h3i4-d5e6-7890-fghi-d12345678901', '550e8400-e29b-41d4-a716-446655440003', '2025-11-08', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678902', '550e8400-e29b-41d4-a716-446655440003', '2025-11-10', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678903', '550e8400-e29b-41d4-a716-446655440003', '2025-11-10', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678904', '550e8400-e29b-41d4-a716-446655440003', '2025-11-11', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 80.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678905', '550e8400-e29b-41d4-a716-446655440003', '2025-11-11', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 80.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678906', '550e8400-e29b-41d4-a716-446655440003', '2025-11-13', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 100.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678907', '550e8400-e29b-41d4-a716-446655440003', '2025-11-13', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 100.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678908', '550e8400-e29b-41d4-a716-446655440003', '2025-11-14', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 80.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678909', '550e8400-e29b-41d4-a716-446655440003', '2025-11-14', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 80.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678910', '550e8400-e29b-41d4-a716-446655440003', '2025-11-14', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 0, 100.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678911', '550e8400-e29b-41d4-a716-446655440003', '2025-11-15', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678912', '550e8400-e29b-41d4-a716-446655440003', '2025-11-13', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true),
('f1g2h3i4-d5e6-7890-fghi-d12345678913', '550e8400-e29b-41d4-a716-446655440003', '2025-11-13', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 0, 100.00, true)
ON CONFLICT (id) DO NOTHING;
