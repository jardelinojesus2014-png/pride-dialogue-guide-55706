
CREATE TABLE public.content_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Nova Pasta',
  tab_type text NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view content folders" ON public.content_folders FOR SELECT USING (true);
CREATE POLICY "Admins can insert content folders" ON public.content_folders FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update content folders" ON public.content_folders FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete content folders" ON public.content_folders FOR DELETE USING (is_admin(auth.uid()));

ALTER TABLE public.folder_artes ADD COLUMN folder_id uuid REFERENCES public.content_folders(id) ON DELETE CASCADE;
