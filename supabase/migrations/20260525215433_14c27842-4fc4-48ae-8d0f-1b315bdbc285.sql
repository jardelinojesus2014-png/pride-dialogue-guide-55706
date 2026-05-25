ALTER TABLE public.exam_settings
  ADD COLUMN IF NOT EXISTS study_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS scheduled_start timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_end timestamptz;