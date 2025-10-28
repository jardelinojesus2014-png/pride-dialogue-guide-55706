-- Add spin_type column to qualification_items
ALTER TABLE public.qualification_items
ADD COLUMN spin_type TEXT CHECK (spin_type IN ('S', 'P', NULL));