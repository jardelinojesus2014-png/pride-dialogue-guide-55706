
-- Fix: Change all anonymous-facing SELECT policies to require authentication
-- Tables with "Everyone can view" or similar policies using public role

-- campaigns
DROP POLICY IF EXISTS "Everyone can view campaigns" ON public.campaigns;
CREATE POLICY "Authenticated users can view campaigns" ON public.campaigns FOR SELECT TO authenticated USING (true);

-- informativos
DROP POLICY IF EXISTS "Everyone can view informativos" ON public.informativos;
CREATE POLICY "Authenticated users can view informativos" ON public.informativos FOR SELECT TO authenticated USING (true);

-- artes
DROP POLICY IF EXISTS "Everyone can view artes" ON public.artes;
CREATE POLICY "Authenticated users can view artes" ON public.artes FOR SELECT TO authenticated USING (true);

-- folder_artes
DROP POLICY IF EXISTS "Everyone can view folder artes" ON public.folder_artes;
CREATE POLICY "Authenticated users can view folder artes" ON public.folder_artes FOR SELECT TO authenticated USING (true);

-- content_folders
DROP POLICY IF EXISTS "Everyone can view content folders" ON public.content_folders;
CREATE POLICY "Authenticated users can view content folders" ON public.content_folders FOR SELECT TO authenticated USING (true);

-- script_items
DROP POLICY IF EXISTS "Everyone can view script items" ON public.script_items;
CREATE POLICY "Authenticated users can view script items" ON public.script_items FOR SELECT TO authenticated USING (true);

-- qualification_items
DROP POLICY IF EXISTS "Everyone can view qualification items" ON public.qualification_items;
CREATE POLICY "Authenticated users can view qualification items" ON public.qualification_items FOR SELECT TO authenticated USING (true);

-- cadencia_items
DROP POLICY IF EXISTS "Everyone can view cadencia items" ON public.cadencia_items;
CREATE POLICY "Authenticated users can view cadencia items" ON public.cadencia_items FOR SELECT TO authenticated USING (true);

-- cadencia_days
DROP POLICY IF EXISTS "Everyone can view cadencia days" ON public.cadencia_days;
CREATE POLICY "Authenticated users can view cadencia days" ON public.cadencia_days FOR SELECT TO authenticated USING (true);

-- cadencia_item_attachments (check policy name)
DROP POLICY IF EXISTS "Everyone can view cadencia item attachments" ON public.cadencia_item_attachments;
DROP POLICY IF EXISTS "Anyone can view cadencia item attachments" ON public.cadencia_item_attachments;
CREATE POLICY "Authenticated users can view cadencia item attachments" ON public.cadencia_item_attachments FOR SELECT TO authenticated USING (true);

-- training_categories
DROP POLICY IF EXISTS "Everyone can view training categories" ON public.training_categories;
CREATE POLICY "Authenticated users can view training categories" ON public.training_categories FOR SELECT TO authenticated USING (true);

-- training_category_content
DROP POLICY IF EXISTS "Everyone can view training category content" ON public.training_category_content;
DROP POLICY IF EXISTS "Anyone can view training category content" ON public.training_category_content;
CREATE POLICY "Authenticated users can view training category content" ON public.training_category_content FOR SELECT TO authenticated USING (true);

-- operadoras
DROP POLICY IF EXISTS "Everyone can view operadoras" ON public.operadoras;
CREATE POLICY "Authenticated users can view operadoras" ON public.operadoras FOR SELECT TO authenticated USING (true);

-- operadora_content
DROP POLICY IF EXISTS "Everyone can view operadora_content" ON public.operadora_content;
CREATE POLICY "Authenticated users can view operadora content" ON public.operadora_content FOR SELECT TO authenticated USING (true);

-- fluxo_videos
DROP POLICY IF EXISTS "Everyone can view fluxo videos" ON public.fluxo_videos;
CREATE POLICY "Authenticated users can view fluxo videos" ON public.fluxo_videos FOR SELECT TO authenticated USING (true);

-- fluxo_audio_files
DROP POLICY IF EXISTS "Everyone can view fluxo audio files" ON public.fluxo_audio_files;
CREATE POLICY "Authenticated users can view fluxo audio files" ON public.fluxo_audio_files FOR SELECT TO authenticated USING (true);

-- institutional_videos
DROP POLICY IF EXISTS "Everyone can view institutional videos" ON public.institutional_videos;
CREATE POLICY "Authenticated users can view institutional videos" ON public.institutional_videos FOR SELECT TO authenticated USING (true);

-- podcasts
DROP POLICY IF EXISTS "Anyone can view podcasts" ON public.podcasts;
CREATE POLICY "Authenticated users can view podcasts" ON public.podcasts FOR SELECT TO authenticated USING (true);

-- pdf_files
DROP POLICY IF EXISTS "Everyone can view PDF files" ON public.pdf_files;
CREATE POLICY "Authenticated users can view PDF files" ON public.pdf_files FOR SELECT TO authenticated USING (true);

-- video_links
DROP POLICY IF EXISTS "Everyone can view video links" ON public.video_links;
CREATE POLICY "Authenticated users can view video links" ON public.video_links FOR SELECT TO authenticated USING (true);

-- google_reviews
DROP POLICY IF EXISTS "Everyone can view google reviews" ON public.google_reviews;
CREATE POLICY "Authenticated users can view google reviews" ON public.google_reviews FOR SELECT TO authenticated USING (true);

-- google_review_settings
DROP POLICY IF EXISTS "Everyone can view google review settings" ON public.google_review_settings;
CREATE POLICY "Authenticated users can view google review settings" ON public.google_review_settings FOR SELECT TO authenticated USING (true);

-- mission_vision_values
DROP POLICY IF EXISTS "Everyone can view mission vision values" ON public.mission_vision_values;
CREATE POLICY "Authenticated users can view mission vision values" ON public.mission_vision_values FOR SELECT TO authenticated USING (true);

-- how_to_use_video
DROP POLICY IF EXISTS "Anyone can view tutorial video" ON public.how_to_use_video;
CREATE POLICY "Authenticated users can view tutorial video" ON public.how_to_use_video FOR SELECT TO authenticated USING (true);

-- section_titles (already uses authenticated role, but let's ensure consistency)
-- section_titles already has "Anyone can read section titles" TO authenticated, so no change needed
