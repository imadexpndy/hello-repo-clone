-- Clear Test Data Script for Hello Planet App
-- This script removes all test data while preserving admin accounts

-- First, let's identify admin accounts to preserve
-- Admin accounts should have admin_role = 'super_admin' or role = 'admin'

-- Delete test reservations (keep admin reservations if any)
DELETE FROM reservations 
WHERE user_id NOT IN (
  SELECT user_id FROM profiles 
  WHERE admin_role = 'super_admin' OR role = 'admin'
);

-- Delete test profiles (keep only admin profiles)
DELETE FROM profiles 
WHERE admin_role != 'super_admin' 
  AND role != 'admin'
  AND email NOT LIKE '%admin%'
  AND email NOT LIKE '%@edjs.art';

-- Delete test schools (keep real schools)
DELETE FROM schools 
WHERE verification_status = 'pending' 
  OR name LIKE '%test%' 
  OR name LIKE '%Test%'
  OR name LIKE '%TEST%';

-- Delete test associations
DELETE FROM associations 
WHERE verification_status = 'pending' 
  OR name LIKE '%test%' 
  OR name LIKE '%Test%'
  OR name LIKE '%TEST%';

-- Delete test messages
DELETE FROM messages 
WHERE sender_id NOT IN (
  SELECT user_id FROM profiles 
  WHERE admin_role = 'super_admin' OR role = 'admin'
)
AND recipient_id NOT IN (
  SELECT user_id FROM profiles 
  WHERE admin_role = 'super_admin' OR role = 'admin'
);

-- Delete test audit logs (optional - keep for security)
-- DELETE FROM audit_logs 
-- WHERE user_id NOT IN (
--   SELECT user_id FROM profiles 
--   WHERE admin_role = 'super_admin' OR role = 'admin'
-- );

-- Delete test invitations
DELETE FROM invitations 
WHERE status = 'pending' 
  AND created_at < NOW() - INTERVAL '30 days';

-- Reset auto-increment counters if needed
-- ALTER SEQUENCE reservations_id_seq RESTART WITH 1;
-- ALTER SEQUENCE schools_id_seq RESTART WITH 1;
-- ALTER SEQUENCE associations_id_seq RESTART WITH 1;

-- Verify remaining data
SELECT 'Remaining Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Remaining Reservations', COUNT(*) FROM reservations
UNION ALL
SELECT 'Remaining Schools', COUNT(*) FROM schools
UNION ALL
SELECT 'Remaining Associations', COUNT(*) FROM associations
UNION ALL
SELECT 'Remaining Messages', COUNT(*) FROM messages;

-- Show admin accounts that were preserved
SELECT 
  email, 
  full_name, 
  role, 
  admin_role, 
  created_at 
FROM profiles 
WHERE admin_role = 'super_admin' OR role = 'admin'
ORDER BY created_at;
