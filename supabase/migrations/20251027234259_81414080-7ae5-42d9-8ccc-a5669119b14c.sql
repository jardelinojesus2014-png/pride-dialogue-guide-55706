-- Adicionar campo de último acesso na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN last_sign_in_at TIMESTAMP WITH TIME ZONE;

-- Criar função para atualizar o último acesso
CREATE OR REPLACE FUNCTION public.update_last_sign_in()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = NEW.last_sign_in_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- Criar trigger para atualizar automaticamente o último acesso
CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_sign_in();

-- Criar políticas RLS para admins gerenciarem roles
CREATE POLICY "Admins podem atualizar roles de usuários"
ON public.user_roles
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins podem inserir roles de usuários"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins podem deletar roles de usuários"
ON public.user_roles
FOR DELETE
USING (public.is_admin(auth.uid()));