-- Add video_url and file_url columns to qualification_items
ALTER TABLE public.qualification_items
ADD COLUMN video_url TEXT,
ADD COLUMN file_url TEXT,
ADD COLUMN file_name TEXT;