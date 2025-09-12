-- Complete session mapping for all remaining sessions from sessions.ts
-- This ensures every session ID from the frontend has a corresponding database entry

-- Add missing L'EAU LA sessions (leau-9 to leau-13)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- leau-9: Casablanca scolaire-publique
  ('550e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440004', '2025-11-14', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  -- leau-10: Casablanca scolaire-privee
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440004', '2025-11-14', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 100.00, true),
  -- leau-11: Casablanca tout-public
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440004', '2025-11-15', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),
  -- leau-12: Rabat scolaire-privee (additional session)
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440004', '2025-11-13', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  -- leau-13: Rabat scolaire-privee (additional session)
  ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440004', '2025-11-13', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),

  -- Add missing MIRATH ATFAL sessions (ma-5 to ma-9)
  -- ma-5: Rabat scolaire-privee
  ('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440005', '2025-11-13', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  -- ma-6: Rabat scolaire-publique
  ('550e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440005', '2025-11-13', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  -- ma-7: Rabat association
  ('550e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440005', '2025-11-14', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  -- ma-8: Rabat association
  ('550e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440005', '2025-11-14', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  -- ma-9: Rabat tout-public
  ('550e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440005', '2025-11-15', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),

  -- Add missing SIMPLE COMME BONJOUR sessions (scb-9, scb-10)
  -- scb-9: Casablanca association
  ('550e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440006', '2025-12-19', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  -- scb-10: Casablanca tout-public
  ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440006', '2025-12-20', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true)

ON CONFLICT (id) DO NOTHING;

-- Add corresponding session ID mappings
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  -- L'EAU LA additional mappings
  ('leau-9', '550e8400-e29b-41d4-a716-446655440039'),
  ('leau-10', '550e8400-e29b-41d4-a716-446655440040'),
  ('leau-11', '550e8400-e29b-41d4-a716-446655440041'),
  ('leau-12', '550e8400-e29b-41d4-a716-446655440042'),
  ('leau-13', '550e8400-e29b-41d4-a716-446655440043'),
  
  -- MIRATH ATFAL additional mappings
  ('ma-5', '550e8400-e29b-41d4-a716-446655440044'),
  ('ma-6', '550e8400-e29b-41d4-a716-446655440045'),
  ('ma-7', '550e8400-e29b-41d4-a716-446655440046'),
  ('ma-8', '550e8400-e29b-41d4-a716-446655440047'),
  ('ma-9', '550e8400-e29b-41d4-a716-446655440048'),
  
  -- SIMPLE COMME BONJOUR additional mappings
  ('scb-9', '550e8400-e29b-41d4-a716-446655440049'),
  ('scb-10', '550e8400-e29b-41d4-a716-446655440050')

ON CONFLICT (frontend_id) DO NOTHING;
