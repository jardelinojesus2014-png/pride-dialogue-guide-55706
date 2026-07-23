-- Documentação estruturada e editável por operadora (estilo GitBook).

-- 1) Campos de cabeçalho da operadora (subtítulo, tags e nº ANS)
ALTER TABLE public.operadoras
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS ans TEXT;

-- 2) Tópicos de documentação (título + texto em markdown + ordem)
CREATE TABLE IF NOT EXISTS public.operadora_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operadora_id UUID NOT NULL REFERENCES public.operadoras(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.operadora_topics ENABLE ROW LEVEL SECURITY;

-- Todos leem; apenas admins criam/editam/excluem (mesmo padrão das outras tabelas)
CREATE POLICY "Everyone can view operadora_topics" ON public.operadora_topics
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert operadora_topics" ON public.operadora_topics
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update operadora_topics" ON public.operadora_topics
  FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete operadora_topics" ON public.operadora_topics
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS operadora_topics_operadora_idx
  ON public.operadora_topics (operadora_id, display_order);
