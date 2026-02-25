
-- Create campaigns table
CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  operadora_name text NOT NULL,
  operadora_logo_url text,
  banner_image_url text,
  banner_image_path text,
  status text NOT NULL DEFAULT 'ativa',
  campaign_type text NOT NULL DEFAULT 'campanha',
  start_date date,
  end_date date,
  tags text[] DEFAULT '{}',
  details_content text,
  creative_file_urls text[] DEFAULT '{}',
  creative_file_paths text[] DEFAULT '{}',
  creative_file_names text[] DEFAULT '{}',
  display_order integer DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Admins can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update campaigns" ON public.campaigns FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete campaigns" ON public.campaigns FOR DELETE USING (public.is_admin(auth.uid()));

-- Create artes table
CREATE TABLE public.artes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  file_url text NOT NULL,
  file_path text,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.artes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view artes" ON public.artes FOR SELECT USING (true);
CREATE POLICY "Admins can insert artes" ON public.artes FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update artes" ON public.artes FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete artes" ON public.artes FOR DELETE USING (public.is_admin(auth.uid()));

-- Create storage bucket for campaigns and artes
INSERT INTO storage.buckets (id, name, public) VALUES ('campaigns', 'campaigns', true);

CREATE POLICY "Everyone can view campaign files" ON storage.objects FOR SELECT USING (bucket_id = 'campaigns');
CREATE POLICY "Admins can upload campaign files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'campaigns' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update campaign files" ON storage.objects FOR UPDATE USING (bucket_id = 'campaigns' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete campaign files" ON storage.objects FOR DELETE USING (bucket_id = 'campaigns' AND public.is_admin(auth.uid()));
