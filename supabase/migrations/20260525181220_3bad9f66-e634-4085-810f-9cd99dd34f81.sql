
CREATE TABLE public.erminia_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  email TEXT,
  participant_name TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_erminia_conversations_updated_at ON public.erminia_conversations(updated_at DESC);
CREATE INDEX idx_erminia_conversations_email ON public.erminia_conversations(email);

ALTER TABLE public.erminia_conversations ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon iframe) can insert their own session
CREATE POLICY "Anyone can insert erminia conversations"
ON public.erminia_conversations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can update an existing session (used for appending messages)
CREATE POLICY "Anyone can update erminia conversations"
ON public.erminia_conversations
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Only admins can view conversations
CREATE POLICY "Admins can view erminia conversations"
ON public.erminia_conversations
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete erminia conversations"
ON public.erminia_conversations
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

CREATE TRIGGER update_erminia_conversations_updated_at
BEFORE UPDATE ON public.erminia_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
