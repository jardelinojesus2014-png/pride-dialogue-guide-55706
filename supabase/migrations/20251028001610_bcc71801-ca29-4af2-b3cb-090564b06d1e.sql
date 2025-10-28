-- Create video_links table for roteiro de prospecção videos
CREATE TABLE public.video_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;

-- Create policies for video_links
CREATE POLICY "Everyone can view video links"
ON public.video_links
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert video links"
ON public.video_links
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete video links"
ON public.video_links
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create storage bucket for video files
INSERT INTO storage.buckets (id, name, public)
VALUES ('video_files', 'video_files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for video_files
CREATE POLICY "Public can view video files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'video_files');

CREATE POLICY "Admins can upload video files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'video_files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete video files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'video_files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_video_links_updated_at
BEFORE UPDATE ON public.video_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();