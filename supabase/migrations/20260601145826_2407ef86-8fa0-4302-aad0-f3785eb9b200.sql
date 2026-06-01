CREATE TABLE public.exam_schedule_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id text NOT NULL,
  label text,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  allowed_emails text[] NOT NULL DEFAULT '{}'::text[],
  display_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX exam_schedule_windows_exam_id_idx ON public.exam_schedule_windows(exam_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_schedule_windows TO authenticated;
GRANT ALL ON public.exam_schedule_windows TO service_role;

ALTER TABLE public.exam_schedule_windows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exam schedule windows"
ON public.exam_schedule_windows FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert exam schedule windows"
ON public.exam_schedule_windows FOR INSERT TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update exam schedule windows"
ON public.exam_schedule_windows FOR UPDATE TO authenticated
USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete exam schedule windows"
ON public.exam_schedule_windows FOR DELETE TO authenticated
USING (is_admin(auth.uid()));

CREATE TRIGGER update_exam_schedule_windows_updated_at
BEFORE UPDATE ON public.exam_schedule_windows
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();