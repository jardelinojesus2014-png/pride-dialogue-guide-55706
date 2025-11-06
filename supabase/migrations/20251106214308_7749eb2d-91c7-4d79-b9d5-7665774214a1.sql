-- Create table for how-to-use tutorial video
CREATE TABLE public.how_to_use_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Como usar a ferramenta',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.how_to_use_video ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view the video
CREATE POLICY "Anyone can view tutorial video"
  ON public.how_to_use_video
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert
CREATE POLICY "Only admins can insert tutorial video"
  ON public.how_to_use_video
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can update
CREATE POLICY "Only admins can update tutorial video"
  ON public.how_to_use_video
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can delete
CREATE POLICY "Only admins can delete tutorial video"
  ON public.how_to_use_video
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for tutorial videos if needed
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutorial-videos', 'tutorial-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for tutorial videos
CREATE POLICY "Anyone can view tutorial videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tutorial-videos');

CREATE POLICY "Only admins can upload tutorial videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'tutorial-videos' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete tutorial videos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'tutorial-videos' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );