-- Create table for user purpose reflections
CREATE TABLE public.user_purpose_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  why TEXT,
  why_here TEXT,
  what_control TEXT,
  improve_what TEXT,
  strengths TEXT,
  what_today TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_purpose_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own reflections"
ON public.user_purpose_reflections
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections"
ON public.user_purpose_reflections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
ON public.user_purpose_reflections
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
ON public.user_purpose_reflections
FOR DELETE
USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all reflections"
ON public.user_purpose_reflections
FOR SELECT
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_purpose_reflections_updated_at
BEFORE UPDATE ON public.user_purpose_reflections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();