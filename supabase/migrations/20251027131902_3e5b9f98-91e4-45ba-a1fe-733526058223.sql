-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create new policy that allows users to view their own profile OR admins to view all profiles
CREATE POLICY "Users can view own profile or admins can view all"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR public.is_admin(auth.uid()));