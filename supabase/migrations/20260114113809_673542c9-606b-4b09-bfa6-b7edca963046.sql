-- Create a table to store editable page section titles
CREATE TABLE public.section_titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_titles ENABLE ROW LEVEL SECURITY;

-- Everyone can read section titles
CREATE POLICY "Anyone can read section titles"
ON public.section_titles
FOR SELECT
TO authenticated
USING (true);

-- Only admins can modify section titles
CREATE POLICY "Only admins can insert section titles"
ON public.section_titles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update section titles"
ON public.section_titles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete section titles"
ON public.section_titles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_section_titles_updated_at
BEFORE UPDATE ON public.section_titles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default values
INSERT INTO public.section_titles (section_key, title, subtitle) VALUES
('cadencia_header', 'Fluxo/ Cadência - Qualificação', 'Acompanhe o fluxo de cadência dos seus atendimentos dia a dia'),
('roteiro_header', 'Roteiro de Prospecção SDR', 'Primeira Etapa da Venda'),
('materiais_header', 'Materiais Adicionais', 'Recursos complementares para seu trabalho'),
('pride_header', 'Conheça a Pride Corretora', 'Informações sobre a empresa');