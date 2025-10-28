-- Create google_reviews table
CREATE TABLE public.google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name TEXT NOT NULL,
  reviewer_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view, only admins can modify
CREATE POLICY "Everyone can view google reviews"
  ON public.google_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert google reviews"
  ON public.google_reviews
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update google reviews"
  ON public.google_reviews
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete google reviews"
  ON public.google_reviews
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON public.google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create settings table for Google review link
CREATE TABLE public.google_review_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_link TEXT NOT NULL,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  average_rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.google_review_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view google review settings"
  ON public.google_review_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert google review settings"
  ON public.google_review_settings
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update google review settings"
  ON public.google_review_settings
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete google review settings"
  ON public.google_review_settings
  FOR DELETE
  USING (is_admin(auth.uid()));

CREATE TRIGGER update_google_review_settings_updated_at
  BEFORE UPDATE ON public.google_review_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();