-- Eventos de uso da área de Treinamentos (para o painel de analytics do admin).
CREATE TABLE IF NOT EXISTS public.training_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,          -- operadora_view | category_view | topic_view | search
  ref_id TEXT,
  ref_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users insert own training events" ON public.training_events;
DROP POLICY IF EXISTS "Admins read training events" ON public.training_events;

-- Qualquer usuário logado registra os próprios eventos
CREATE POLICY "Users insert own training events" ON public.training_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Apenas admins leem os dados (analytics)
CREATE POLICY "Admins read training events" ON public.training_events
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS training_events_type_created_idx
  ON public.training_events (type, created_at DESC);
