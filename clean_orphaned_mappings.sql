-- Clean up orphaned mappings that don't have corresponding sessions in the database

-- First, show what we're about to delete
SELECT 
  m.frontend_id,
  m.database_uuid,
  'WILL BE DELETED - NO SESSION FOUND' as action
FROM session_id_mapping m
LEFT JOIN sessions s ON s.id = m.database_uuid
WHERE s.id IS NULL;

-- Delete orphaned mappings
DELETE FROM session_id_mapping 
WHERE database_uuid IN (
  SELECT m.database_uuid
  FROM session_id_mapping m
  LEFT JOIN sessions s ON s.id = m.database_uuid
  WHERE s.id IS NULL
);

-- Show remaining mappings count by spectacle prefix
SELECT 
  SUBSTRING(m.frontend_id FROM '^([^-]+)') as spectacle_prefix,
  COUNT(*) as mapping_count
FROM session_id_mapping m 
GROUP BY SUBSTRING(m.frontend_id FROM '^([^-]+)')
ORDER BY spectacle_prefix;

-- Verify all remaining mappings have valid sessions
SELECT 
  COUNT(*) as total_mappings,
  COUNT(s.id) as valid_mappings,
  COUNT(*) - COUNT(s.id) as orphaned_mappings
FROM session_id_mapping m
LEFT JOIN sessions s ON s.id = m.database_uuid;
