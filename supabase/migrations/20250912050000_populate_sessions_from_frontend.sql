-- Migration to populate sessions table with data from sessions.ts
-- This creates the missing sessions that are referenced in the frontend

-- First, ensure we have spectacles in the database
INSERT INTO public.spectacles (id, title, slug, description, age_range, duration, language, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Le Petit Prince', 'le-petit-prince', 'Spectacle basé sur l''œuvre de Saint-Exupéry', '6+', 90, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Le Petit Prince (Version Arabe)', 'le-petit-prince-ar', 'Version arabe du Petit Prince', '6+', 90, 'Arabe', 'published'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Tara sur la Lune', 'tara-sur-la-lune', 'Aventure spatiale pour enfants', '5+', 75, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440004', 'L''Eau Là', 'leau-la', 'Spectacle sur l''environnement', '7+', 80, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Mirath Atfal', 'mirath-atfal', 'Patrimoine culturel pour enfants', '8+', 85, 'Arabe/Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Simple comme Bonjour', 'simple-comme-bonjour', 'Comédie familiale', '4+', 70, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Charlotte', 'charlotte', 'Spectacle musical', '6+', 95, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Estevanico', 'estevanico', 'Histoire d''aventure', '9+', 100, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Flash', 'flash', 'Spectacle de super-héros', '7+', 85, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440010', 'Antigone', 'antigone', 'Tragédie grecque adaptée', '12+', 110, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Alice chez les Merveilles', 'alice-chez-les-merveilles', 'Adaptation du conte de Lewis Carroll', '5+', 90, 'Français', 'published')
ON CONFLICT (id) DO NOTHING;

-- Now insert all sessions with proper UUID mapping
-- Using deterministic UUIDs based on session IDs from sessions.ts

-- LE PETIT PRINCE sessions
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  -- lpp-1 to lpp-10
  ('550e8400-e29b-41d4-a716-4c7070310000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-04', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-4c7070320000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-06', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-4c7070330000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-06', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-4c7070340000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-07', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  ('550e8400-e29b-41d4-a716-4c7070350000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-07', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  ('550e8400-e29b-41d4-a716-4c7070360000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-09', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-4c7070370000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-09', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-4c7070380000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-10', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 100.00, true),
  ('550e8400-e29b-41d4-a716-4c7070390000', '550e8400-e29b-41d4-a716-446655440001', '2025-10-10', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 100.00, true),
  ('550e8400-e29b-41d4-a716-4c7070310001', '550e8400-e29b-41d4-a716-446655440001', '2025-10-11', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- LE PETIT PRINCE AR sessions (lpp-ar-1, lpp-ar-2)
  ('550e8400-e29b-41d4-a716-6c7061723100', '550e8400-e29b-41d4-a716-446655440002', '2025-10-05', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-6c7061723200', '550e8400-e29b-41d4-a716-446655440002', '2025-10-12', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- TARA SUR LA LUNE sessions (tsl-1 to tsl-8)
  ('550e8400-e29b-41d4-a716-74736c310000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-11', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-74736c320000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-09', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-74736c330000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-09', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  ('550e8400-e29b-41d4-a716-74736c340000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-10', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  ('550e8400-e29b-41d4-a716-74736c350000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-18', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-74736c360000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-13', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 100.00, true),
  ('550e8400-e29b-41d4-a716-74736c370000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-14', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-74736c380000', '550e8400-e29b-41d4-a716-446655440003', '2025-10-14', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),

  -- L'EAU LA sessions (leau-1 to leau-8)
  ('550e8400-e29b-41d4-a716-6c656175310000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-08', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-6c656175320000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-10', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-6c656175330000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-10', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-6c656175340000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-11', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  ('550e8400-e29b-41d4-a716-6c656175350000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-11', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 80.00, true),
  ('550e8400-e29b-41d4-a716-6c656175360000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-13', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 100.00, true),
  ('550e8400-e29b-41d4-a716-6c656175370000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-13', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 100.00, true),
  ('550e8400-e29b-41d4-a716-6c656175380000', '550e8400-e29b-41d4-a716-446655440004', '2025-11-15', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),
  
  -- MIRATH ATFAL sessions (ma-1 to ma-4)
  ('550e8400-e29b-41d4-a716-6d61310000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-08', '15:00', 'THEATRE ZEFZAF', 'Casablanca', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-6d61320000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-10', '09:30', 'THEATRE ZEFZAF', 'Casablanca', 300, 300, 100.00, true),
  ('550e8400-e29b-41d4-a716-6d61330000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-10', '14:30', 'THEATRE ZEFZAF', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-6d61340000000', '550e8400-e29b-41d4-a716-446655440005', '2025-11-11', '14:30', 'THEATRE ZEFZAF', 'Casablanca', 300, 300, 80.00, true)

ON CONFLICT (id) DO NOTHING;

-- Create a mapping table for frontend session IDs to database UUIDs
CREATE TABLE IF NOT EXISTS public.session_id_mapping (
    frontend_id TEXT PRIMARY KEY,
    database_uuid UUID NOT NULL REFERENCES public.sessions(id)
);

-- Insert the mappings
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  -- LE PETIT PRINCE mappings
  ('lpp-1', '550e8400-e29b-41d4-a716-4c7070310000'),
  ('lpp-2', '550e8400-e29b-41d4-a716-4c7070320000'),
  ('lpp-3', '550e8400-e29b-41d4-a716-4c7070330000'),
  ('lpp-4', '550e8400-e29b-41d4-a716-4c7070340000'),
  ('lpp-5', '550e8400-e29b-41d4-a716-4c7070350000'),
  ('lpp-6', '550e8400-e29b-41d4-a716-4c7070360000'),
  ('lpp-7', '550e8400-e29b-41d4-a716-4c7070370000'),
  ('lpp-8', '550e8400-e29b-41d4-a716-4c7070380000'),
  ('lpp-9', '550e8400-e29b-41d4-a716-4c7070390000'),
  ('lpp-10', '550e8400-e29b-41d4-a716-4c7070310001'),
  
  -- LE PETIT PRINCE AR mappings
  ('lpp-ar-1', '550e8400-e29b-41d4-a716-6c7061723100'),
  ('lpp-ar-2', '550e8400-e29b-41d4-a716-6c7061723200'),
  
  -- TARA SUR LA LUNE mappings
  ('tsl-1', '550e8400-e29b-41d4-a716-74736c310000'),
  ('tsl-2', '550e8400-e29b-41d4-a716-74736c320000'),
  ('tsl-3', '550e8400-e29b-41d4-a716-74736c330000'),
  ('tsl-4', '550e8400-e29b-41d4-a716-74736c340000'),
  ('tsl-5', '550e8400-e29b-41d4-a716-74736c350000'),
  ('tsl-6', '550e8400-e29b-41d4-a716-74736c360000'),
  ('tsl-7', '550e8400-e29b-41d4-a716-74736c370000'),
  ('tsl-8', '550e8400-e29b-41d4-a716-74736c380000'),
  
  -- L'EAU LA mappings
  ('leau-1', '550e8400-e29b-41d4-a716-6c656175310000'),
  ('leau-2', '550e8400-e29b-41d4-a716-6c656175320000'),
  ('leau-3', '550e8400-e29b-41d4-a716-6c656175330000'),
  ('leau-4', '550e8400-e29b-41d4-a716-6c656175340000'),
  ('leau-5', '550e8400-e29b-41d4-a716-6c656175350000'),
  ('leau-6', '550e8400-e29b-41d4-a716-6c656175360000'),
  ('leau-7', '550e8400-e29b-41d4-a716-6c656175370000'),
  ('leau-8', '550e8400-e29b-41d4-a716-6c656175380000'),
  
  -- MIRATH ATFAL mappings
  ('ma-1', '550e8400-e29b-41d4-a716-6d61310000000'),
  ('ma-2', '550e8400-e29b-41d4-a716-6d61320000000'),
  ('ma-3', '550e8400-e29b-41d4-a716-6d61330000000'),
  ('ma-4', '550e8400-e29b-41d4-a716-6d61340000000')

ON CONFLICT (frontend_id) DO NOTHING;
