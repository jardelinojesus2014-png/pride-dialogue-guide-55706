
CREATE TABLE public.erminia_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'text',
  file_url TEXT,
  file_path TEXT,
  content_text TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.erminia_sources TO authenticated;
GRANT ALL ON public.erminia_sources TO service_role;

ALTER TABLE public.erminia_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view erminia sources"
ON public.erminia_sources FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert erminia sources"
ON public.erminia_sources FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update erminia sources"
ON public.erminia_sources FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete erminia sources"
ON public.erminia_sources FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE TRIGGER update_erminia_sources_updated_at
BEFORE UPDATE ON public.erminia_sources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('erminia_sources', 'erminia_sources', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read erminia_sources bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'erminia_sources');

CREATE POLICY "Admins upload erminia_sources bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'erminia_sources' AND is_admin(auth.uid()));

CREATE POLICY "Admins delete erminia_sources bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'erminia_sources' AND is_admin(auth.uid()));

CREATE POLICY "Admins update erminia_sources bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'erminia_sources' AND is_admin(auth.uid()));
