GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_conversations TO authenticated;
GRANT ALL ON public.erminia_conversations TO service_role;

DROP POLICY IF EXISTS "Logged users can insert own erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Logged users can update own erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Admins can view erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Admins can delete erminia conversations" ON public.erminia_conversations;

CREATE POLICY "Logged users can insert own erminia conversations"
ON public.erminia_conversations
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Logged users can update own erminia conversations"
ON public.erminia_conversations
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR public.is_admin(auth.uid()))
WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can view erminia conversations"
ON public.erminia_conversations
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete erminia conversations"
ON public.erminia_conversations
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));