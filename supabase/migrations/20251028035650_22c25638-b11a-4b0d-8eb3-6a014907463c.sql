-- Add response_options column to script_items
-- This will store client responses and suggested conducts
ALTER TABLE public.script_items 
ADD COLUMN IF NOT EXISTS response_options JSONB;

-- Update the column comment to explain the structure
COMMENT ON COLUMN public.script_items.response_options IS 'Array of objects with client_response and suggested_conduct keys';

-- Example structure:
-- [
--   {
--     "client_response": "Sim, tenho interesse",
--     "suggested_conduct": "Ótimo! Então vamos seguir para..."
--   },
--   {
--     "client_response": "Não tenho interesse agora",
--     "suggested_conduct": "Entendo. Podemos marcar para outro momento?"
--   }
-- ]