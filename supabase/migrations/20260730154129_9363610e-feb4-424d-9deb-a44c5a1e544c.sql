WITH r AS (
  SELECT id, row_number() OVER (PARTITION BY operadora_id ORDER BY display_order, created_at) - 1 AS rn
  FROM public.operadora_topics
)
UPDATE public.operadora_topics t SET display_order = r.rn FROM r WHERE t.id = r.id AND t.display_order IS DISTINCT FROM r.rn;

WITH r AS (
  SELECT id, row_number() OVER (PARTITION BY category_id ORDER BY display_order, created_at) - 1 AS rn
  FROM public.category_topics
)
UPDATE public.category_topics t SET display_order = r.rn FROM r WHERE t.id = r.id AND t.display_order IS DISTINCT FROM r.rn;