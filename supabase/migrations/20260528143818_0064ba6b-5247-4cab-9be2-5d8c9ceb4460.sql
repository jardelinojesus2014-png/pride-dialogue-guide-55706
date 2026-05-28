GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_conversations TO authenticated;
GRANT ALL ON public.erminia_conversations TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;