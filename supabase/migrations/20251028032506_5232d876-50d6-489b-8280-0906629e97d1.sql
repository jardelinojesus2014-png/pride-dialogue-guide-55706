-- Create table for PDF files
CREATE TABLE public.pdf_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.pdf_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view PDF files"
  ON public.pdf_files
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert PDF files"
  ON public.pdf_files
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update PDF files"
  ON public.pdf_files
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete PDF files"
  ON public.pdf_files
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdf_files', 'pdf_files', true);

-- Create storage policies
CREATE POLICY "Anyone can view PDF files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pdf_files');

CREATE POLICY "Admins can upload PDF files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'pdf_files' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update PDF files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'pdf_files' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete PDF files"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'pdf_files' AND is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_pdf_files_updated_at
  BEFORE UPDATE ON public.pdf_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();