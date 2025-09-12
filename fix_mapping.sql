-- Fix session_id_mapping to use actual session UUIDs from sessions table

-- First, check what we have
SELECT 'Current mapping:' as info;
SELECT frontend_id, database_uuid FROM session_id_mapping WHERE frontend_id LIKE 'lpp-%' ORDER BY frontend_id;

SELECT 'Actual sessions:' as info;
SELECT id, session_date, session_time FROM sessions 
WHERE spectacle_id = '550e8400-e29b-41d4-a716-446655440000' 
ORDER BY session_date, session_time;

-- Update the mapping to use actual session UUIDs
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

-- Verify the fix
SELECT 'Updated mapping:' as info;
SELECT m.frontend_id, m.database_uuid, s.session_date, s.session_time
FROM session_id_mapping m
JOIN sessions s ON s.id = m.database_uuid
WHERE m.frontend_id LIKE 'lpp-%'
ORDER BY m.frontend_id;
