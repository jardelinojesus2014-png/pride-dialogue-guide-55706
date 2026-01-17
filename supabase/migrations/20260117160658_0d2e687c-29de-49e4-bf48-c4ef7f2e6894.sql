-- Add banner columns to section_titles table
ALTER TABLE public.section_titles
ADD COLUMN show_banner BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN banner_subtitle TEXT;