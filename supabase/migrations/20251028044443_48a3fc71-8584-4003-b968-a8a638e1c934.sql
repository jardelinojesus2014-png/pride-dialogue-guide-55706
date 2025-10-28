-- Drop existing insert and delete policies for user_audio_files
DROP POLICY IF EXISTS "Users can delete their own audio files" ON public.user_audio_files;
DROP POLICY IF EXISTS "Users can insert their own audio files" ON public.user_audio_files;

-- Create new policies allowing only admins to insert and delete
CREATE POLICY "Only admins can insert audio files"
ON public.user_audio_files
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete audio files"
ON public.user_audio_files
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));