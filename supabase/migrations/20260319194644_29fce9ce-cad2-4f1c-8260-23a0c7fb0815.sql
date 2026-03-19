
ALTER TABLE public.campaigns ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.informativos ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.artes ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.content_folders ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;
ALTER TABLE public.folder_artes ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;
