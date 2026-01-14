-- Fix 1: Restrict profiles table - users can only see their own profile
-- Drop the existing policy that allows admins to view all
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON public.profiles;

-- Create a new policy that only allows users to view their own profile
CREATE POLICY "Users can only view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Fix 2: Remove admin access to user_purpose_reflections - it's private data
-- Drop the policy that allows admins to view all reflections
DROP POLICY IF EXISTS "Admins can view all reflections" ON public.user_purpose_reflections;