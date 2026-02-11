
-- Create storage bucket for cadencia item attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('cadencia_attachments', 'cadencia_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cadencia_attachments bucket
CREATE POLICY "Everyone can view cadencia attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'cadencia_attachments');

CREATE POLICY "Admins can upload cadencia attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cadencia_attachments' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete cadencia attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'cadencia_attachments' AND public.is_admin(auth.uid()));

-- Create table for cadencia item attachments
CREATE TABLE public.cadencia_item_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cadencia_item_id UUID NOT NULL REFERENCES public.cadencia_items(id) ON DELETE CASCADE,
  attachment_type TEXT NOT NULL CHECK (attachment_type IN ('audio', 'video', 'pdf')),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT,
  duration_seconds INTEGER,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cadencia_item_attachments ENABLE ROW LEVEL SECURITY;

-- Everyone can view
CREATE POLICY "Everyone can view cadencia item attachments"
ON public.cadencia_item_attachments
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert cadencia item attachments"
ON public.cadencia_item_attachments
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Admins can update cadencia item attachments"
ON public.cadencia_item_attachments
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete cadencia item attachments"
ON public.cadencia_item_attachments
FOR DELETE
USING (public.is_admin(auth.uid()));
