CREATE TABLE public.avaliacoes_admin_state (
  key text NOT NULL PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.avaliacoes_admin_state TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.avaliacoes_admin_state TO authenticated;
GRANT ALL ON public.avaliacoes_admin_state TO service_role;

ALTER TABLE public.avaliacoes_admin_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view avaliacoes admin state"
ON public.avaliacoes_admin_state
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert avaliacoes admin state"
ON public.avaliacoes_admin_state
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update avaliacoes admin state"
ON public.avaliacoes_admin_state
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete avaliacoes admin state"
ON public.avaliacoes_admin_state
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

CREATE TRIGGER update_avaliacoes_admin_state_updated_at
BEFORE UPDATE ON public.avaliacoes_admin_state
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();