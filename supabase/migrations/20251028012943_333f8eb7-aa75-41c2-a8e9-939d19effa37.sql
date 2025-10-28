-- Add examples column to qualification_items (stores array of text)
ALTER TABLE public.qualification_items
ADD COLUMN examples TEXT[];