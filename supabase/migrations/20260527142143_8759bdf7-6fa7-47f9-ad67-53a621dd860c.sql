REVOKE ALL ON public.erminia_conversations FROM anon;

DROP POLICY IF EXISTS "Anonymous iframe can insert erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Anonymous iframe can update erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Logged users can insert erminia conversations" ON public.erminia_conversations;
DROP POLICY IF EXISTS "Logged users can update erminia conversations" ON public.erminia_conversations;

CREATE POLICY "Logged users can insert own erminia conversations"
ON public.erminia_conversations
FOR INSERT
TO authenticated
WITH CHECK (lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Logged users can update own erminia conversations"
ON public.erminia_conversations
FOR UPDATE
TO authenticated
USING (lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', '')))
WITH CHECK (lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', '')));