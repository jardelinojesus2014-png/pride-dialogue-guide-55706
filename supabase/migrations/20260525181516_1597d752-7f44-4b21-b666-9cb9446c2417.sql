
-- cadencia_attachments
CREATE POLICY "Admins can update cadencia_attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'cadencia_attachments' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'cadencia_attachments' AND public.is_admin(auth.uid()));

-- fluxo_audio_files
CREATE POLICY "Admins can update fluxo_audio_files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'fluxo_audio_files' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'fluxo_audio_files' AND public.is_admin(auth.uid()));

-- fluxo_videos
CREATE POLICY "Admins can update fluxo_videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'fluxo_videos' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'fluxo_videos' AND public.is_admin(auth.uid()));

-- tutorial-videos
CREATE POLICY "Admins can update tutorial-videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tutorial-videos' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'tutorial-videos' AND public.is_admin(auth.uid()));

-- video_files
CREATE POLICY "Admins can update video_files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'video_files' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'video_files' AND public.is_admin(auth.uid()));
