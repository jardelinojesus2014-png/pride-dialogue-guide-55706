-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Update RLS policies for script_notes to allow admin access
DROP POLICY IF EXISTS "Users can view own notes" ON public.script_notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.script_notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.script_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.script_notes;

CREATE POLICY "Users can view own notes or admin can view all"
ON public.script_notes
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own notes"
ON public.script_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes or admin can update all"
ON public.script_notes
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete own notes or admin can delete all"
ON public.script_notes
FOR DELETE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update RLS policies for script_checked_items to allow admin access
DROP POLICY IF EXISTS "Users can view own checked items" ON public.script_checked_items;
DROP POLICY IF EXISTS "Users can insert own checked items" ON public.script_checked_items;
DROP POLICY IF EXISTS "Users can update own checked items" ON public.script_checked_items;
DROP POLICY IF EXISTS "Users can delete own checked items" ON public.script_checked_items;

CREATE POLICY "Users can view own checked items or admin can view all"
ON public.script_checked_items
FOR SELECT
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own checked items"
ON public.script_checked_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checked items or admin can update all"
ON public.script_checked_items
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete own checked items or admin can delete all"
ON public.script_checked_items
FOR DELETE
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Update handle_new_user function to assign roles and check domain
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check if email is from allowed domain
  IF NEW.email NOT LIKE '%@pridecorretora.com.br' THEN
    RAISE EXCEPTION 'Only @pridecorretora.com.br email addresses are allowed';
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  -- Assign role: admin for avila@pridecorretora.com.br, user for others
  IF NEW.email = 'avila@pridecorretora.com.br' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$function$;