-- SOLO LECTURA. Ejecutar por el responsable en el Supabase correcto.
-- Alcance exacto: RegiaMare / regiamare_property / published.
-- No contiene escrituras ni vuelve a ejecutar CONTENT_SEO_FIELDS.sql.
BEGIN READ ONLY;

SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'items'
  AND column_name IN ('slug', 'seo_title', 'seo_description', 'seo_og_image_url')
ORDER BY column_name;

SELECT id, company_id, item_type, title, summary, slug, seo_title, seo_description, seo_og_image_url,
  slug IS NULL OR btrim(slug) = '' AS missing_slug,
  slug IS NOT NULL AND (length(slug) > 120 OR slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    OR slug ~* '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$') AS invalid_slug,
  seo_title IS NULL OR btrim(seo_title) = '' OR length(seo_title) > 70 AS incomplete_seo_title,
  seo_description IS NULL OR btrim(seo_description) = '' OR length(seo_description) > 160 AS incomplete_seo_description,
  seo_og_image_url IS NOT NULL AND (seo_og_image_url !~ '^https://' OR length(seo_og_image_url) > 2048) AS invalid_og
FROM public.items
WHERE company_id = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'::uuid
  AND item_type = 'regiamare_property' AND status = 'published'
ORDER BY id;

-- Solo claves de colisión: todos los tipos y estados dentro de la misma empresa.
-- No incluye contenido de borradores ni de otros tenants.
SELECT lower(slug) AS conflicting_slug, count(*) AS total
FROM public.items
WHERE company_id = 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'::uuid AND slug IS NOT NULL
GROUP BY lower(slug) HAVING count(*) > 1;

COMMIT;
