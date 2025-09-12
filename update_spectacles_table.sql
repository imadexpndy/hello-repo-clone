-- Update spectacles table with all 11 spectacles from sessions.ts
-- Clear existing spectacles and insert the correct ones

DELETE FROM public.spectacles;

INSERT INTO public.spectacles (id, title, description, age_range_min, age_range_max, duration_minutes, is_active, created_at, updated_at) VALUES
-- 1. Le Petit Prince
('550e8400-e29b-41d4-a716-446655440000', 'Le Petit Prince', 'Un conte poétique et philosophique', 6, 12, 60, true, NOW(), NOW()),

-- 2. Le Petit Prince (Arabic Version)
('550e8400-e29b-41d4-a716-446655440001', 'Le Petit Prince (Version Arabe)', 'Version arabe du conte poétique', 6, 12, 60, true, NOW(), NOW()),

-- 3. Tara Sur La Lune
('550e8400-e29b-41d4-a716-446655440002', 'Tara Sur La Lune', 'Une aventure spatiale pour enfants', 4, 10, 50, true, NOW(), NOW()),

-- 4. L'Eau Là
('550e8400-e29b-41d4-a716-446655440003', 'L''Eau Là', 'Spectacle sur l''importance de l''eau', 5, 12, 45, true, NOW(), NOW()),

-- 5. Mirath Atfal
('550e8400-e29b-41d4-a716-446655440004', 'Mirath Atfal', 'Patrimoine culturel pour enfants', 6, 14, 55, true, NOW(), NOW()),

-- 6. Simple Comme Bonjour
('550e8400-e29b-41d4-a716-446655440005', 'Simple Comme Bonjour', 'Spectacle sur la politesse et le respect', 4, 10, 40, true, NOW(), NOW()),

-- 7. Charlotte
('550e8400-e29b-41d4-a716-446655440006', 'Charlotte', 'L''histoire de Charlotte et ses aventures', 5, 11, 50, true, NOW(), NOW()),

-- 8. Estevanico
('550e8400-e29b-41d4-a716-446655440007', 'Estevanico', 'L''histoire d''un explorateur', 8, 15, 65, true, NOW(), NOW()),

-- 9. Flash
('550e8400-e29b-41d4-a716-446655440008', 'Flash', 'Spectacle sur la vitesse et l''énergie', 6, 12, 45, true, NOW(), NOW()),

-- 10. Antigone
('550e8400-e29b-41d4-a716-446655440009', 'Antigone', 'Tragédie grecque adaptée pour jeunes', 12, 18, 70, true, NOW(), NOW()),

-- 11. Alice Chez Les Merveilles
('550e8400-e29b-41d4-a716-446655440010', 'Alice Chez Les Merveilles', 'L''aventure d''Alice au pays des merveilles', 5, 12, 55, true, NOW(), NOW());
