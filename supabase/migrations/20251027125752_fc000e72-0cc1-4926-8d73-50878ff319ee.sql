-- Create table for script notes
CREATE TABLE public.script_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, section_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE public.script_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own notes" 
ON public.script_notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.script_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.script_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.script_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_script_notes_updated_at
BEFORE UPDATE ON public.script_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for checked items state
CREATE TABLE public.script_checked_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  section_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, section_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE public.script_checked_items ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own checked items" 
ON public.script_checked_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checked items" 
ON public.script_checked_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checked items" 
ON public.script_checked_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checked items" 
ON public.script_checked_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_script_checked_items_updated_at
BEFORE UPDATE ON public.script_checked_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();