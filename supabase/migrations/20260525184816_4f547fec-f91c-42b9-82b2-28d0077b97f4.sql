
CREATE TABLE public.exam_settings (
  exam_id TEXT PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT true,
  allowed_emails TEXT[] NOT NULL DEFAULT '{}',
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exam settings"
  ON public.exam_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert exam settings"
  ON public.exam_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update exam settings"
  ON public.exam_settings FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete exam settings"
  ON public.exam_settings FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER trg_exam_settings_updated_at
  BEFORE UPDATE ON public.exam_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
