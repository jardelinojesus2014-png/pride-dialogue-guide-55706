-- Modify qualification_items to support multiple entries for all fields
ALTER TABLE public.qualification_items
DROP COLUMN description,
DROP COLUMN tip,
DROP COLUMN video_url,
DROP COLUMN file_url,
DROP COLUMN file_name;

ALTER TABLE public.qualification_items
ADD COLUMN descriptions TEXT[],
ADD COLUMN tips TEXT[],
ADD COLUMN video_urls TEXT[],
ADD COLUMN file_urls TEXT[],
ADD COLUMN file_names TEXT[];

-- Create table for user notes on qualification items
CREATE TABLE public.qualification_user_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.qualification_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.qualification_user_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user notes
CREATE POLICY "Users can view their own notes"
ON public.qualification_user_notes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
ON public.qualification_user_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
ON public.qualification_user_notes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
ON public.qualification_user_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_qualification_user_notes_updated_at
BEFORE UPDATE ON public.qualification_user_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();