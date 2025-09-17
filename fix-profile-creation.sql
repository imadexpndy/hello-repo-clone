-- Fix profile creation for new users
-- This addresses the issue where new user accounts don't appear in admin dashboard

-- 1. First, let's check and fix the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    admin_role,
    user_type,
    full_name,
    verification_status,
    is_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULL, -- Regular users don't have admin_role
    'particulier', -- Default user type
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'approved', -- Auto-approve for now
    true, -- Auto-verify for now
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Ensure the trigger exists and is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Add a policy to allow the trigger to insert profiles
CREATE POLICY IF NOT EXISTS "Allow auth trigger to insert profiles"
ON public.profiles
FOR INSERT
TO supabase_auth_admin
WITH CHECK (true);

-- 4. Also allow service role to insert profiles
CREATE POLICY IF NOT EXISTS "Allow service role to insert profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. Allow authenticated users to insert their own profile (fallback)
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 6. Test function to manually create missing profiles for existing auth users
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user RECORD;
BEGIN
  -- This function can be called to create profiles for existing auth users
  -- who don't have profiles yet (useful for fixing existing accounts)
  
  FOR auth_user IN 
    SELECT id, email, created_at, raw_user_meta_data
    FROM auth.users 
    WHERE id NOT IN (SELECT user_id FROM public.profiles)
  LOOP
    INSERT INTO public.profiles (
      user_id,
      email,
      admin_role,
      user_type,
      full_name,
      verification_status,
      is_verified,
      created_at,
      updated_at
    ) VALUES (
      auth_user.id,
      auth_user.email,
      NULL,
      'particulier',
      COALESCE(auth_user.raw_user_meta_data->>'full_name', auth_user.email),
      'approved',
      true,
      auth_user.created_at,
      NOW()
    );
  END LOOP;
  
  RAISE NOTICE 'Created profiles for existing auth users';
END;
$$;
