-- Fix profile role to match user_type for consistency
UPDATE profiles 
SET role = 'teacher_private'
WHERE user_id = '66d69bb9-c018-4970-b22f-092c19d7a08c' 
AND user_type = 'teacher_private';

-- Verify the update
SELECT 
  user_id,
  user_type,
  professional_type,
  role,
  admin_role,
  verification_status
FROM profiles 
WHERE user_id = '66d69bb9-c018-4970-b22f-092c19d7a08c';
