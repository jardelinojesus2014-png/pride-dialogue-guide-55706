-- Create podcasts table
CREATE TABLE public.podcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Everyone can view podcasts
CREATE POLICY "Anyone can view podcasts"
ON public.podcasts
FOR SELECT
USING (true);

-- Only admins can insert podcasts
CREATE POLICY "Admins can insert podcasts"
ON public.podcasts
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admins can update podcasts
CREATE POLICY "Admins can update podcasts"
ON public.podcasts
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can delete podcasts
CREATE POLICY "Admins can delete podcasts"
ON public.podcasts
FOR DELETE
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();