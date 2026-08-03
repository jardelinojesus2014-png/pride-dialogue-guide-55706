-- 1) Topics tables: restrict SELECT to authenticated
DROP POLICY IF EXISTS "Everyone can view category_topics" ON public.category_topics;
CREATE POLICY "Authenticated can view category_topics"
ON public.category_topics FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Everyone can view operadora_topics" ON public.operadora_topics;
CREATE POLICY "Authenticated can view operadora_topics"
ON public.operadora_topics FOR SELECT TO authenticated USING (true);

REVOKE SELECT ON public.category_topics FROM anon;
REVOKE SELECT ON public.operadora_topics FROM anon;
GRANT SELECT ON public.category_topics TO authenticated;
GRANT SELECT ON public.operadora_topics TO authenticated;

-- 2) storage.objects: remove anonymous listing/read, require authentication
DROP POLICY IF EXISTS "Anyone can view PDF files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view operadoras files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view tutorial videos" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view cadencia attachments" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view campaign files" ON storage.objects;
DROP POLICY IF EXISTS "Permitir visualização pública de áudios" ON storage.objects;
DROP POLICY IF EXISTS "Public can view audio files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view fluxo audio files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view fluxo videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view video files" ON storage.objects;
DROP POLICY IF EXISTS "Public read erminia_sources bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own audio files" ON storage.objects;

CREATE POLICY "Authenticated can read app storage objects"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id IN (
    'pdf_files','operadoras','tutorial-videos','cadencia_attachments',
    'campaigns','audio-files','fluxo_audio_files','fluxo_videos',
    'video_files','erminia_sources'
  )
);