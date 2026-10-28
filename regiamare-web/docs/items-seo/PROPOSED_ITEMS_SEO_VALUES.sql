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
('3eb76f0d-de71-4db5-a380-1bb23257316c', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'vivienda-historica-mercat-santa-caterina-barcelona', 'Vivienda histórica junto al Mercat de Santa Caterina', 'Vivienda de 61 m² y dos dormitorios junto al Mercat de Santa Caterina, Barcelona. Balcón, suelos hidráulicos y vigas de madera. Cuarta planta sin ascensor.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/3eb76f0d-de71-4db5-a380-1bb23257316c/1785142829549_f113d934-c06c-493f-9598-69bb391a0125.webp', '2026-08-06T07:24:35.151304+00:00', NULL, NULL, NULL, NULL),
('10a925a9-567f-455f-ac59-8d5b7a6f89e4', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'loft-46-m2-born-barcelona', 'Loft de 46 m² en el Born, Barcelona', 'Loft de 46 m² construidos en Carrer Sant Pere Mitjà, en el Born de Barcelona. Espacio diáfano con posibilidad de redistribución y comercios cercanos.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/10a925a9-567f-455f-ac59-8d5b7a6f89e4/1784628761301_5d6abf1c-d0bc-479b-898d-4985de348fff.webp', '2026-08-31T11:57:53.2827+00:00', NULL, NULL, NULL, NULL),
('973af166-214a-4b52-96bf-b12841ca075c', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'apartamento-terraza-primera-linea-mar-coma-ruga', 'Apartamento con terraza en primera línea, Coma-ruga', 'Apartamento de 130 m² y tres dormitorios en primera línea de mar en Coma-ruga. Planta baja con terraza de 40 m² y acceso directo al paseo marítimo.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/973af166-214a-4b52-96bf-b12841ca075c/1779788565402_46c15bf7-80bc-43fe-8a84-ace30bc94b38.jpg', '2026-08-10T07:18:54.576146+00:00', NULL, NULL, NULL, NULL),
('991c8fb7-66e7-4eda-9aa9-b9e466771ca4', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'casa-pareada-francaset-roda-de-bera', 'Casa pareada en El Francaset, Roda de Berà', 'Casa pareada de 195 m² construidos y cuatro dormitorios sobre parcela de 460 m² en El Francaset, Roda de Berà, con espacios exteriores.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/991c8fb7-66e7-4eda-9aa9-b9e466771ca4/1779435683464_075d90ec-052c-44d4-bc37-15414f7d2ab1.jpg', '2026-08-06T07:25:03.806707+00:00', NULL, NULL, NULL, NULL),
('01c335d8-1ccd-49bd-90f9-cda4bb441d3f', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'piso-reformado-94-m2-centro-sitges', 'Piso reformado de 94 m² en el centro de Sitges', 'Piso de 94 m² y tres dormitorios con reforma integral en el centro de Sitges, a 200 metros del mar. Instalaciones de agua y electricidad renovadas.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/01c335d8-1ccd-49bd-90f9-cda4bb441d3f/1779184930237_69b03c0d-bd78-4410-99ef-e0be0c874124.jpg', '2026-08-18T09:55:20.411406+00:00', NULL, NULL, NULL, NULL),
('e4dead59-2fdc-4816-a33a-b431d947e4bf', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'planta-baja-jardin-sant-salvador-coma-ruga', 'Planta baja con jardín en Sant Salvador, Coma-ruga', 'Planta baja de 83 m² y dos dormitorios en Sant Salvador, Coma-ruga. Jardín privado, dos terrazas, parking y trastero, a 200 metros de la playa.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/e4dead59-2fdc-4816-a33a-b431d947e4bf/1777028464088_770aa29f-ffb0-4dda-823d-1c6feeef50d8.jpg', '2026-08-06T07:23:52.451469+00:00', NULL, NULL, NULL, NULL),
('5d293e70-f081-4ac5-8641-d082cd73d3c5', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'duplex-reformado-terraza-privada-sitges', 'Dúplex reformado con terraza privada en Sitges', 'Planta baja dúplex reformada de 101 m² en el centro de Sitges. Terraza privada y dos dormitorios dobles con armarios empotrados y balcón.', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/5d293e70-f081-4ac5-8641-d082cd73d3c5/1776328784670_1f494c20-d52e-4c2b-bdbc-8b3e9ba03a31.jpg', '2026-08-06T07:24:22.416877+00:00', NULL, NULL, NULL, NULL),
('a7f3e8b2-4c9d-41a5-8e6f-3d2a1b5c7e9f', 'eac2ccbe-cc36-40cd-bb7e-d5fe44de972d', 'regiamare_property', 'villa-independiente-els-cards-sant-pere-de-ribes', 'Villa independiente en Els Cards, Sant Pere de Ribes', 'Villa independiente de 172 m² y tres dormitorios en Els Cards, Sant Pere de Ribes. Parcela llana de unos 400 m² y garaje de unos 60 m².', 'https://pakbxfdewswzkipeddhr.supabase.co/storage/v1/object/public/items-media/eac2ccbe-cc36-40cd-bb7e-d5fe44de972d/a7f3e8b2-4c9d-41a5-8e6f-3d2a1b5c7e9f/1773421088359_51782891-3f54-4faf-9942-7f6049cf6ae8.png', '2026-08-06T07:51:03.213798+00:00', NULL, NULL, NULL, NULL);

DO $guard$
BEGIN
  IF (SELECT count(*) FROM _regiamare_seo_batch) <> 8 THEN
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
