CREATE TABLE public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id bigint,
  exam_id text NOT NULL,
  email text,
  participant_name text,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  pct integer NOT NULL DEFAULT 0,
  time_seconds integer NOT NULL DEFAULT 0,
  version integer NOT NULL DEFAULT 1,
  attempt integer NOT NULL DEFAULT 1,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  q_times jsonb NOT NULL DEFAULT '[]'::jsonb,
  auto_submitted boolean NOT NULL DEFAULT false,
  date_iso timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert exam attempts"
  ON public.exam_attempts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view exam attempts"
  ON public.exam_attempts FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete exam attempts"
  ON public.exam_attempts FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE INDEX idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_email ON public.exam_attempts(email);
CREATE INDEX idx_exam_attempts_date ON public.exam_attempts(date_iso DESC);