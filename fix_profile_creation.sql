-- Fix the handle_new_user trigger to NOT set default user_type
-- This allows the registration form to properly set the user_type without being overridden
-- Execute this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    admin_role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    'b2c_user', -- Default role for new users
    NOW(),
    NOW()
  );
  -- Note: user_type is NOT set here - it will be set by the registration form
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
