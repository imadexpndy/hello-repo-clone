-- Check all spectacles and their session counts
SELECT 
  spectacle_id,
  COUNT(*) as session_count
FROM sessions 
GROUP BY spectacle_id 
ORDER BY spectacle_id;

-- Check all sessions in the table
SELECT spectacle_id, id, session_date, session_time, venue 
FROM sessions 
ORDER BY spectacle_id, session_date, session_time;
