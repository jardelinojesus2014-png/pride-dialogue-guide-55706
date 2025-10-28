-- Create mission_vision_values table
CREATE TABLE public.mission_vision_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  values TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mission_vision_values ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view, only admins can modify
CREATE POLICY "Everyone can view mission vision values"
  ON public.mission_vision_values
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert mission vision values"
  ON public.mission_vision_values
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update mission vision values"
  ON public.mission_vision_values
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete mission vision values"
  ON public.mission_vision_values
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mission_vision_values_updated_at
  BEFORE UPDATE ON public.mission_vision_values
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();