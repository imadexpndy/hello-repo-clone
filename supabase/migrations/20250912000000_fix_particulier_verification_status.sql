-- Fix verification status for existing particulier accounts
-- Particulier users should have admin_role = NULL (not 'b2c_user') due to check constraint

UPDATE profiles 
SET verification_status = 'approved',
    is_verified = true
WHERE (admin_role IS NULL OR admin_role = 'b2c_user')
  AND verification_status = 'pending';

-- Set admin_role to NULL for any b2c_user entries (they violate constraint)
UPDATE profiles 
SET admin_role = NULL
WHERE admin_role = 'b2c_user';
