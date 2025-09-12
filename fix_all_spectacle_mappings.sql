-- Fix session_id_mapping for all spectacles to use actual session UUIDs

-- First, let's see all spectacles and their session counts
SELECT 
  s.spectacle_id,
  COUNT(*) as session_count,
  MIN(s.session_date) as first_date,
  MAX(s.session_date) as last_date
FROM sessions s 
GROUP BY s.spectacle_id 
ORDER BY s.spectacle_id;

-- Check current mappings for all spectacles
SELECT 
  SUBSTRING(m.frontend_id FROM '^([^-]+)') as spectacle_prefix,
  COUNT(*) as mapping_count
FROM session_id_mapping m 
GROUP BY SUBSTRING(m.frontend_id FROM '^([^-]+)')
ORDER BY spectacle_prefix;

-- Update mappings for LE PETIT PRINCE (already done, but included for completeness)
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440000'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'lpp-' || actual_sessions.rn;

-- Update mappings for LE PETIT PRINCE ARABIC
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440001'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'lppar-' || actual_sessions.rn;

-- Update mappings for TARA SUR LA LUNE
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440002'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'tara-' || actual_sessions.rn;

-- Update mappings for ESTEVANICO
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440003'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'est-' || actual_sessions.rn;

-- Update mappings for CHARLOTTE
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440004'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'char-' || actual_sessions.rn;

-- Update mappings for ALICE CHEZ LES MERVEILLES
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440005'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'alice-' || actual_sessions.rn;

-- Update mappings for L'EAU LA
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440006'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'eau-' || actual_sessions.rn;

-- Update mappings for MIRATH ATFAL
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440007'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'mirath-' || actual_sessions.rn;

-- Update mappings for SIMPLE COMME BONJOUR
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440008'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'simple-' || actual_sessions.rn;

-- Update mappings for FLASH
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440009'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'flash-' || actual_sessions.rn;

-- Update mappings for ANTIGONE
WITH actual_sessions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY session_date, session_time) as rn
  FROM sessions 
  WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440010'
  ORDER BY session_date, session_time
)
UPDATE session_id_mapping 
SET database_uuid = actual_sessions.id
FROM actual_sessions
WHERE session_id_mapping.frontend_id = 'ant-' || actual_sessions.rn;

-- Verify all mappings are now correct
SELECT 
  m.frontend_id, 
  m.database_uuid, 
  s.spectacle_id,
  s.session_date, 
  s.session_time,
  s.venue
FROM session_id_mapping m
JOIN sessions s ON s.id = m.database_uuid
ORDER BY s.spectacle_id, s.session_date, s.session_time;

-- Check for any orphaned mappings (mappings without corresponding sessions)
SELECT 
  m.frontend_id,
  m.database_uuid,
  'ORPHANED - NO SESSION FOUND' as status
FROM session_id_mapping m
LEFT JOIN sessions s ON s.id = m.database_uuid
WHERE s.id IS NULL;
