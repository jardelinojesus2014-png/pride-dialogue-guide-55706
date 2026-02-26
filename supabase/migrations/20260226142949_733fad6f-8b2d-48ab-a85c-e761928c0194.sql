
-- Create informativos table (mirrors campaigns structure)
CREATE TABLE public.informativos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  operadora_name TEXT NOT NULL DEFAULT '',
  operadora_logo_url TEXT,
  banner_image_url TEXT,
  banner_image_path TEXT,
  status TEXT NOT NULL DEFAULT 'ativa',
  start_date DATE,
  end_date DATE,
  campaign_type TEXT NOT NULL DEFAULT 'informativo',
  tags TEXT[] DEFAULT '{}',
  details_content TEXT,
  creative_file_urls TEXT[] DEFAULT '{}',
  creative_file_paths TEXT[] DEFAULT '{}',
  creative_file_names TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.informativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view informativos" ON public.informativos FOR SELECT USING (true);
CREATE POLICY "Admins can insert informativos" ON public.informativos FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update informativos" ON public.informativos FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete informativos" ON public.informativos FOR DELETE USING (is_admin(auth.uid()));

-- Add campaign-like fields to artes for same functionality
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ativa';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS operadora_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS operadora_logo_url TEXT;
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS details_content TEXT;
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS campaign_type TEXT NOT NULL DEFAULT 'arte';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS creative_file_urls TEXT[] DEFAULT '{}';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS creative_file_paths TEXT[] DEFAULT '{}';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS creative_file_names TEXT[] DEFAULT '{}';
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
ALTER TABLE public.artes ADD COLUMN IF NOT EXISTS banner_image_path TEXT;
