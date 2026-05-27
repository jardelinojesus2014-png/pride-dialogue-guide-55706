
GRANT SELECT, INSERT, UPDATE ON public.erminia_conversations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_conversations TO authenticated;
GRANT ALL ON public.erminia_conversations TO service_role;

GRANT SELECT ON public.erminia_sources TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_sources TO authenticated;
GRANT ALL ON public.erminia_sources TO service_role;

GRANT SELECT, INSERT ON public.exam_attempts TO anon;
GRANT SELECT, INSERT ON public.exam_attempts TO authenticated;
GRANT ALL ON public.exam_attempts TO service_role;
