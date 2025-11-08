-- Create table for cadencia days (title and subtitle)
CREATE TABLE IF NOT EXISTS public.cadencia_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cadencia_days ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view cadencia days"
  ON public.cadencia_days
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert cadencia days"
  ON public.cadencia_days
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update cadencia days"
  ON public.cadencia_days
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete cadencia days"
  ON public.cadencia_days
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Insert initial data for the 4 days
INSERT INTO public.cadencia_days (day_id, title, subtitle) VALUES
  ('dia1', 'DIA 1', 'Primeiro contato - Apresentação e qualificação inicial'),
  ('dia2', 'DIA 2', 'Follow-up - Reforço com vídeo institucional'),
  ('dia3', 'DIA 3', 'Reengajamento - Credibilidade com avaliações'),
  ('dia4', 'DIA 4', 'Encerramento - Última tentativa e disponibilização');