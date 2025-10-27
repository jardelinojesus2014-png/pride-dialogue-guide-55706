-- Create table for user audio files
CREATE TABLE public.user_audio_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section_id TEXT NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_audio_files ENABLE ROW LEVEL SECURITY;

-- Create policies for user audio files
CREATE POLICY "Users can view their own audio files"
ON public.user_audio_files
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audio files"
ON public.user_audio_files
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audio files"
ON public.user_audio_files
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audio files"
ON public.user_audio_files
FOR DELETE
USING (auth.uid() = user_id);

-- Admin can view all audio files
CREATE POLICY "Admins can view all audio files"
ON public.user_audio_files
FOR SELECT
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_user_audio_files_updated_at
BEFORE UPDATE ON public.user_audio_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_user_audio_files_user_id ON public.user_audio_files(user_id);
CREATE INDEX idx_user_audio_files_section_id ON public.user_audio_files(section_id);