
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email NOT LIKE '%@pridecorretora.com.br' THEN
    RAISE EXCEPTION 'Only @pridecorretora.com.br email addresses are allowed';
  END IF;

  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  IF NEW.email IN ('avila@pridecorretora.com.br', 'matheus@pridecorretora.com.br') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$$;
