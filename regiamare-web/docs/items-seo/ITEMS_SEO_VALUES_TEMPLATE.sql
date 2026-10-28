-- Plantilla local de revisión: no se ha recibido la plantilla del repositorio CRM.
-- El script prepare-items-seo.mjs sustituye los marcadores con el lote revisable.
-- No ejecutar sin aprobación editorial y ITEMS_SEO_PREFLIGHT.sql administrativo.
BEGIN;
CREATE TEMP TABLE _regiamare_seo_batch (
  id uuid PRIMARY KEY, company_id uuid NOT NULL, item_type text NOT NULL,
  slug text NOT NULL, seo_title text NOT NULL, seo_description text NOT NULL,
  seo_og_image_url text, expected_updated_at timestamptz NOT NULL,
  old_slug text, old_title text, old_description text, old_image text
) ON COMMIT DROP;

INSERT INTO _regiamare_seo_batch VALUES
__REVIEWED_VALUES__;

DO $guard$
BEGIN
  IF (SELECT count(*) FROM _regiamare_seo_batch) <> __EXPECTED_COUNT__ THEN
    RAISE EXCEPTION 'Lote incompleto';
  END IF;
  IF EXISTS (SELECT 1 FROM _regiamare_seo_batch WHERE
    company_id <> 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d'::uuid OR item_type <> 'regiamare_property'
    OR length(slug) > 120 OR slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    OR slug ~* '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$'
    OR length(seo_title) NOT BETWEEN 1 AND 70 OR length(seo_description) NOT BETWEEN 1 AND 160
    OR (seo_og_image_url IS NOT NULL AND (seo_og_image_url !~ '^https://' OR length(seo_og_image_url) > 2048))) THEN
    RAISE EXCEPTION 'Alcance o metadatos inválidos';
  END IF;
  IF EXISTS (SELECT lower(slug) FROM _regiamare_seo_batch GROUP BY lower(slug) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Slugs duplicados dentro del lote';
  END IF;
  PERFORM i.id FROM public.items i JOIN _regiamare_seo_batch b ON b.id = i.id FOR UPDATE OF i;
  IF EXISTS (SELECT 1 FROM _regiamare_seo_batch b LEFT JOIN public.items i ON i.id = b.id
    WHERE i.id IS NULL OR i.company_id <> b.company_id OR i.item_type <> b.item_type OR i.status <> 'published'
      OR i.updated_at IS DISTINCT FROM b.expected_updated_at
      OR (i.slug, i.seo_title, i.seo_description, i.seo_og_image_url)
        IS DISTINCT FROM (b.old_slug, b.old_title, b.old_description, b.old_image)) THEN
    RAISE EXCEPTION 'El contenido ha cambiado desde el export o no pertenece al alcance: volver a auditar';
  END IF;
  IF EXISTS (SELECT 1 FROM _regiamare_seo_batch b JOIN public.items i
    ON i.company_id = b.company_id AND lower(i.slug) = lower(b.slug) AND i.id <> b.id) THEN
    RAISE EXCEPTION 'Slug ocupado en la empresa (incluye todos los tipos/estados)';
  END IF;
END;
$guard$;

UPDATE public.items i SET slug = b.slug, seo_title = b.seo_title,
  seo_description = b.seo_description, seo_og_image_url = b.seo_og_image_url, updated_at = now()
FROM _regiamare_seo_batch b
WHERE i.id = b.id AND i.company_id = b.company_id AND i.item_type = b.item_type AND i.status = 'published';

SELECT i.id, i.company_id, i.item_type, i.slug, i.seo_title, i.seo_description, i.seo_og_image_url, i.updated_at
FROM public.items i JOIN _regiamare_seo_batch b ON b.id = i.id ORDER BY i.id;

-- Por defecto, este lote solo ensaya: revisar SELECT y conservar resultados.
-- Cambiar ROLLBACK por COMMIT únicamente después de aprobar textos, URLs y SQL.
ROLLBACK;
