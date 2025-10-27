-- Add unique constraint to script_notes to support upsert operations
ALTER TABLE public.script_notes 
ADD CONSTRAINT script_notes_user_section_item_unique 
UNIQUE (user_id, section_id, item_id);

-- Add unique constraint to script_checked_items to support upsert operations
ALTER TABLE public.script_checked_items 
ADD CONSTRAINT script_checked_items_user_section_item_unique 
UNIQUE (user_id, section_id, item_id);