-- Add warnings column to qualification_items
ALTER TABLE public.qualification_items 
ADD COLUMN IF NOT EXISTS warnings TEXT[];