GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_conversations TO authenticated;
GRANT INSERT, UPDATE ON public.erminia_conversations TO anon;
GRANT ALL ON public.erminia_conversations TO service_role;

DROP POLICY IF EXISTS "Anyone can insert erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Anyone can update erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Admins can view erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Admins can delete erminia conversations" ON public.erminia_conversations;

CREATE POLICY "Admins can view erminia conversations"
ON public.erminia_conversations
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete erminia conversations"
ON public.erminia_conversations
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Logged users can insert erminia conversations"
ON public.erminia_conversations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Logged users can update erminia conversations"
ON public.erminia_conversations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Anonymous iframe can insert erminia conversations"
ON public.erminia_conversations
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anonymous iframe can update erminia conversations"
ON public.erminia_conversations
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);