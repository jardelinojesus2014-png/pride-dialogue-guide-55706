-- Add show_banner column to training_categories
ALTER TABLE public.training_categories
ADD COLUMN show_banner BOOLEAN NOT NULL DEFAULT false;

-- Add banner_subtitle column for custom subtitle text
ALTER TABLE public.training_categories
ADD COLUMN banner_subtitle TEXT;

-- Update the existing operadoras category to show banner with default subtitle
UPDATE public.training_categories
SET show_banner = true,
    banner_subtitle = 'Essa seção está sendo desenvolvida e enriquecida semanalmente'
WHERE is_operadoras_section = true;