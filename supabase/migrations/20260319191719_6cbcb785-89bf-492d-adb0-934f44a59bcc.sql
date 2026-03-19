
CREATE TABLE public.folder_artes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  operadora_name TEXT NOT NULL DEFAULT '',
  operadora_logo_url TEXT,
  banner_image_url TEXT,
  banner_image_path TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'ativa',
  campaign_type TEXT NOT NULL DEFAULT 'arte',
  start_date DATE,
  end_date DATE,
  tags TEXT[] DEFAULT '{}',
  details_content TEXT,
  creative_file_urls TEXT[] DEFAULT '{}',
  creative_file_paths TEXT[] DEFAULT '{}',
  creative_file_names TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.folder_artes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view folder artes" ON public.folder_artes FOR SELECT USING (true);
CREATE POLICY "Admins can insert folder artes" ON public.folder_artes FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update folder artes" ON public.folder_artes FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete folder artes" ON public.folder_artes FOR DELETE USING (is_admin(auth.uid()));
