-- Create table for operators (operadoras)
CREATE TABLE public.operadoras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  logo_path TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create table for operator content (videos, pdfs, photos, audio)
CREATE TABLE public.operadora_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operadora_id UUID NOT NULL REFERENCES public.operadoras(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'pdf', 'photo', 'audio')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.operadoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operadora_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for operadoras
CREATE POLICY "Everyone can view operadoras" ON public.operadoras
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert operadoras" ON public.operadoras
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update operadoras" ON public.operadoras
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete operadoras" ON public.operadoras
  FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS policies for operadora_content
CREATE POLICY "Everyone can view operadora_content" ON public.operadora_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert operadora_content" ON public.operadora_content
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update operadora_content" ON public.operadora_content
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete operadora_content" ON public.operadora_content
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Create storage bucket for operadoras
INSERT INTO storage.buckets (id, name, public) VALUES ('operadoras', 'operadoras', true);

-- Storage policies
CREATE POLICY "Anyone can view operadoras files" ON storage.objects
  FOR SELECT USING (bucket_id = 'operadoras');

CREATE POLICY "Admins can upload operadoras files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'operadoras' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update operadoras files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'operadoras' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete operadoras files" ON storage.objects
  FOR DELETE USING (bucket_id = 'operadoras' AND public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_operadoras_updated_at
  BEFORE UPDATE ON public.operadoras
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_operadora_content_updated_at
  BEFORE UPDATE ON public.operadora_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();