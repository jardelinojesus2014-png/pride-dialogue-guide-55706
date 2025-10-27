-- Create fluxo_audio_files table
CREATE TABLE public.fluxo_audio_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fluxo_videos table
CREATE TABLE public.fluxo_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fluxo_audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fluxo_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for fluxo_audio_files
CREATE POLICY "Everyone can view fluxo audio files"
ON public.fluxo_audio_files
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert fluxo audio files"
ON public.fluxo_audio_files
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete fluxo audio files"
ON public.fluxo_audio_files
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for fluxo_videos
CREATE POLICY "Everyone can view fluxo videos"
ON public.fluxo_videos
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert fluxo videos"
ON public.fluxo_videos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete fluxo videos"
ON public.fluxo_videos
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('fluxo_audio_files', 'fluxo_audio_files', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('fluxo_videos', 'fluxo_videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for fluxo_audio_files
CREATE POLICY "Public can view fluxo audio files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'fluxo_audio_files');

CREATE POLICY "Admins can upload fluxo audio files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'fluxo_audio_files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete fluxo audio files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'fluxo_audio_files' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create storage policies for fluxo_videos
CREATE POLICY "Public can view fluxo videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'fluxo_videos');

CREATE POLICY "Admins can upload fluxo videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'fluxo_videos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete fluxo videos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'fluxo_videos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_fluxo_audio_files_updated_at
BEFORE UPDATE ON public.fluxo_audio_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fluxo_videos_updated_at
BEFORE UPDATE ON public.fluxo_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();