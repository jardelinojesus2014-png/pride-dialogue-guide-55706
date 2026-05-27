GRANT INSERT ON public.exam_attempts TO anon;
GRANT SELECT, INSERT, DELETE ON public.exam_attempts TO authenticated;
GRANT ALL ON public.exam_attempts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_conversations TO authenticated;
GRANT ALL ON public.erminia_conversations TO service_role;