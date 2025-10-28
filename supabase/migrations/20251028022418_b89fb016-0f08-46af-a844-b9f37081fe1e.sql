-- Create institutional_videos table
CREATE TABLE public.institutional_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.institutional_videos ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view, only admins can modify
CREATE POLICY "Everyone can view institutional videos"
  ON public.institutional_videos
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert institutional videos"
  ON public.institutional_videos
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update institutional videos"
  ON public.institutional_videos
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete institutional videos"
  ON public.institutional_videos
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_institutional_videos_updated_at
  BEFORE UPDATE ON public.institutional_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();