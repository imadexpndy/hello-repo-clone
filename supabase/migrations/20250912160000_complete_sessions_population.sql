-- Complete session population for all 11 spectacles
-- This migration adds sessions for the 6 missing spectacles

-- First ensure all spectacles exist
INSERT INTO public.spectacles (id, title, slug, description, age_range, duration, language, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440006', 'Simple comme Bonjour', 'simple-comme-bonjour', 'Comédie familiale', '4+', 70, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Charlotte', 'charlotte', 'Spectacle musical', '6+', 95, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Estevanico', 'estevanico', 'Histoire d''aventure', '9+', 100, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Flash', 'flash', 'Spectacle de super-héros', '7+', 85, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440010', 'Antigone', 'antigone', 'Tragédie grecque adaptée', '12+', 110, 'Français', 'published'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Alice chez les Merveilles', 'alice-chez-les-merveilles', 'Adaptation du conte de Lewis Carroll', '5+', 90, 'Français', 'published')
ON CONFLICT (id) DO NOTHING;

-- SIMPLE COMME BONJOUR sessions (scb-1 to scb-6)
INSERT INTO public.sessions (id, spectacle_id, session_date, session_time, venue, city, total_capacity, b2c_capacity, price_mad, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-736362623100', '550e8400-e29b-41d4-a716-446655440006', '2025-12-01', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-736362623200', '550e8400-e29b-41d4-a716-446655440006', '2025-12-03', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-736362623300', '550e8400-e29b-41d4-a716-446655440006', '2025-12-03', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-736362623400', '550e8400-e29b-41d4-a716-446655440006', '2025-12-05', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-736362623500', '550e8400-e29b-41d4-a716-446655440006', '2025-12-05', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-736362623600', '550e8400-e29b-41d4-a716-446655440006', '2025-12-07', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- CHARLOTTE sessions (ch-1 to ch-6)
  ('550e8400-e29b-41d4-a716-636831000000', '550e8400-e29b-41d4-a716-446655440007', '2025-12-08', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-636832000000', '550e8400-e29b-41d4-a716-446655440007', '2025-12-10', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-636833000000', '550e8400-e29b-41d4-a716-446655440007', '2025-12-10', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-636834000000', '550e8400-e29b-41d4-a716-446655440007', '2025-12-12', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-636835000000', '550e8400-e29b-41d4-a716-446655440007', '2025-12-12', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-636836000000', '550e8400-e29b-41d4-a716-446655440007', '2025-12-14', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- ESTEVANICO sessions (est-1 to est-6)
  ('550e8400-e29b-41d4-a716-657374310000', '550e8400-e29b-41d4-a716-446655440008', '2025-12-15', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-657374320000', '550e8400-e29b-41d4-a716-446655440008', '2025-12-17', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-657374330000', '550e8400-e29b-41d4-a716-446655440008', '2025-12-17', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-657374340000', '550e8400-e29b-41d4-a716-446655440008', '2025-12-19', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-657374350000', '550e8400-e29b-41d4-a716-446655440008', '2025-12-19', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-657374360000', '550e8400-e29b-41d4-a716-446655440008', '2025-12-21', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- FLASH sessions (fl-1 to fl-6)
  ('550e8400-e29b-41d4-a716-666c31000000', '550e8400-e29b-41d4-a716-446655440009', '2025-12-22', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-666c32000000', '550e8400-e29b-41d4-a716-446655440009', '2025-12-24', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-666c33000000', '550e8400-e29b-41d4-a716-446655440009', '2025-12-24', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-666c34000000', '550e8400-e29b-41d4-a716-446655440009', '2025-12-26', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-666c35000000', '550e8400-e29b-41d4-a716-446655440009', '2025-12-26', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-666c36000000', '550e8400-e29b-41d4-a716-446655440009', '2025-12-28', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- ANTIGONE sessions (ant-1 to ant-6)
  ('550e8400-e29b-41d4-a716-616e74310000', '550e8400-e29b-41d4-a716-446655440010', '2026-01-05', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-616e74320000', '550e8400-e29b-41d4-a716-446655440010', '2026-01-07', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-616e74330000', '550e8400-e29b-41d4-a716-446655440010', '2026-01-07', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-616e74340000', '550e8400-e29b-41d4-a716-446655440010', '2026-01-09', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-616e74350000', '550e8400-e29b-41d4-a716-446655440010', '2026-01-09', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-616e74360000', '550e8400-e29b-41d4-a716-446655440010', '2026-01-11', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true),

  -- ALICE CHEZ LES MERVEILLES sessions (alice-1 to alice-6)
  ('550e8400-e29b-41d4-a716-616c69636531', '550e8400-e29b-41d4-a716-446655440011', '2026-01-12', '15:00', 'THEATRE BAHNINI', 'Rabat', 220, 220, 80.00, true),
  ('550e8400-e29b-41d4-a716-616c69636532', '550e8400-e29b-41d4-a716-446655440011', '2026-01-14', '09:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-616c69636533', '550e8400-e29b-41d4-a716-446655440011', '2026-01-14', '14:30', 'THEATRE BAHNINI', 'Rabat', 400, 400, 100.00, true),
  ('550e8400-e29b-41d4-a716-616c69636534', '550e8400-e29b-41d4-a716-446655440011', '2026-01-16', '09:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-616c69636535', '550e8400-e29b-41d4-a716-446655440011', '2026-01-16', '14:30', 'COMPLEXE EL HASSANI', 'Casablanca', 300, 300, 80.00, true),
  ('550e8400-e29b-41d4-a716-616c69636536', '550e8400-e29b-41d4-a716-446655440011', '2026-01-18', '15:00', 'COMPLEXE EL HASSANI', 'Casablanca', 220, 220, 80.00, true)

ON CONFLICT (id) DO NOTHING;

-- Add session mappings for the new spectacles
INSERT INTO public.session_id_mapping (frontend_id, database_uuid)
VALUES 
  -- SIMPLE COMME BONJOUR mappings
  ('scb-1', '550e8400-e29b-41d4-a716-736362623100'),
  ('scb-2', '550e8400-e29b-41d4-a716-736362623200'),
  ('scb-3', '550e8400-e29b-41d4-a716-736362623300'),
  ('scb-4', '550e8400-e29b-41d4-a716-736362623400'),
  ('scb-5', '550e8400-e29b-41d4-a716-736362623500'),
  ('scb-6', '550e8400-e29b-41d4-a716-736362623600'),
  
  -- CHARLOTTE mappings
  ('ch-1', '550e8400-e29b-41d4-a716-636831000000'),
  ('ch-2', '550e8400-e29b-41d4-a716-636832000000'),
  ('ch-3', '550e8400-e29b-41d4-a716-636833000000'),
  ('ch-4', '550e8400-e29b-41d4-a716-636834000000'),
  ('ch-5', '550e8400-e29b-41d4-a716-636835000000'),
  ('ch-6', '550e8400-e29b-41d4-a716-636836000000'),
  
  -- ESTEVANICO mappings
  ('est-1', '550e8400-e29b-41d4-a716-657374310000'),
  ('est-2', '550e8400-e29b-41d4-a716-657374320000'),
  ('est-3', '550e8400-e29b-41d4-a716-657374330000'),
  ('est-4', '550e8400-e29b-41d4-a716-657374340000'),
  ('est-5', '550e8400-e29b-41d4-a716-657374350000'),
  ('est-6', '550e8400-e29b-41d4-a716-657374360000'),
  
  -- FLASH mappings
  ('fl-1', '550e8400-e29b-41d4-a716-666c31000000'),
  ('fl-2', '550e8400-e29b-41d4-a716-666c32000000'),
  ('fl-3', '550e8400-e29b-41d4-a716-666c33000000'),
  ('fl-4', '550e8400-e29b-41d4-a716-666c34000000'),
  ('fl-5', '550e8400-e29b-41d4-a716-666c35000000'),
  ('fl-6', '550e8400-e29b-41d4-a716-666c36000000'),
  
  -- ANTIGONE mappings
  ('ant-1', '550e8400-e29b-41d4-a716-616e74310000'),
  ('ant-2', '550e8400-e29b-41d4-a716-616e74320000'),
  ('ant-3', '550e8400-e29b-41d4-a716-616e74330000'),
  ('ant-4', '550e8400-e29b-41d4-a716-616e74340000'),
  ('ant-5', '550e8400-e29b-41d4-a716-616e74350000'),
  ('ant-6', '550e8400-e29b-41d4-a716-616e74360000'),
  
  -- ALICE CHEZ LES MERVEILLES mappings
  ('alice-1', '550e8400-e29b-41d4-a716-616c69636531'),
  ('alice-2', '550e8400-e29b-41d4-a716-616c69636532'),
  ('alice-3', '550e8400-e29b-41d4-a716-616c69636533'),
  ('alice-4', '550e8400-e29b-41d4-a716-616c69636534'),
  ('alice-5', '550e8400-e29b-41d4-a716-616c69636535'),
  ('alice-6', '550e8400-e29b-41d4-a716-616c69636536')

ON CONFLICT (frontend_id) DO NOTHING;
