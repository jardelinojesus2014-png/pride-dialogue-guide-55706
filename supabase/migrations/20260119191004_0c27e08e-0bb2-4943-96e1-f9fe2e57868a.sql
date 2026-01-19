-- Drop the admin-only INSERT policy
DROP POLICY IF EXISTS "Only admins can insert audio files" ON public.user_audio_files;

-- Create a new policy that allows users to insert their own audio files
CREATE POLICY "Users can insert their own audio files"
ON public.user_audio_files
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also fix the DELETE policy to allow users to delete their own files
DROP POLICY IF EXISTS "Only admins can delete audio files" ON public.user_audio_files;

CREATE POLICY "Users can delete their own audio files"
ON public.user_audio_files
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);