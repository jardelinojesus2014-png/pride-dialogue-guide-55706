CREATE TABLE public.exam_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  is_builtin boolean NOT NULL DEFAULT false,
  bank jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  allowed_emails text[] NOT NULL DEFAULT '{}'::text[],
  study_enabled boolean NOT NULL DEFAULT true,
  scheduled_start timestamp with time zone,
  scheduled_end timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_definitions TO authenticated;
GRANT ALL ON public.exam_definitions TO service_role;

ALTER TABLE public.exam_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exam definitions"
ON public.exam_definitions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert exam definitions"
ON public.exam_definitions
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update exam definitions"
ON public.exam_definitions
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete exam definitions"
ON public.exam_definitions
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

CREATE TRIGGER update_exam_definitions_updated_at
BEFORE UPDATE ON public.exam_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();