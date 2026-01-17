-- Create training_categories table
CREATE TABLE public.training_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'folder',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_operadoras_section BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.training_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Everyone can view training categories"
ON public.training_categories
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert training categories"
ON public.training_categories
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update training categories"
ON public.training_categories
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete training categories"
ON public.training_categories
FOR DELETE
USING (is_admin(auth.uid()));

-- Create training_category_content table for content within each category
CREATE TABLE public.training_category_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.training_categories(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
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
ALTER TABLE public.training_category_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for content
CREATE POLICY "Everyone can view training category content"
ON public.training_category_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert training category content"
ON public.training_category_content
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update training category content"
ON public.training_category_content
FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete training category content"
ON public.training_category_content
FOR DELETE
USING (is_admin(auth.uid()));

-- Insert default category for Operadoras (will be handled specially in code)
INSERT INTO public.training_categories (title, description, icon, display_order, is_operadoras_section)
VALUES ('Treinamento de Operadoras', 'Treinamentos específicos para cada operadora de saúde', 'building-2', 0, true);