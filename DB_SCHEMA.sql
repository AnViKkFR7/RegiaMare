-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attribute_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  item_type text NOT NULL,
  key text NOT NULL,
  label text NOT NULL,
  data_type text NOT NULL,
  is_filterable boolean NOT NULL DEFAULT false,
  is_required boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT attribute_definitions_pkey PRIMARY KEY (id),
  CONSTRAINT attribute_definitions_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT attribute_definitions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT attribute_definitions_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.attribute_values (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  attribute_id uuid NOT NULL,
  value_text text,
  value_number numeric,
  value_boolean boolean,
  value_date date,
  value_json jsonb,
  value_text_array ARRAY,
  value_number_array ARRAY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT attribute_values_pkey PRIMARY KEY (id),
  CONSTRAINT attribute_values_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
  CONSTRAINT attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attribute_definitions(id),
  CONSTRAINT attribute_values_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT attribute_values_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.blog_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  file_type text NOT NULL,
  url_externa text NOT NULL,
  title text,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb,
  is_cover_image boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT blog_media_pkey PRIMARY KEY (id),
  CONSTRAINT blog_media_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id),
  CONSTRAINT blog_media_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT blog_media_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  heading text,
  intro text,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT blog_posts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT blog_posts_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  description text,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  website_url text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_edited_by uuid,
  CONSTRAINT companies_pkey PRIMARY KEY (id),
  CONSTRAINT companies_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT companies_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.company_members (
  company_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'editor'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  full_name text NOT NULL DEFAULT ''::text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT company_members_pkey PRIMARY KEY (company_id, user_id),
  CONSTRAINT company_members_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT company_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT company_members_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT company_members_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.item_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  file_type text NOT NULL,
  url_externa text NOT NULL,
  title text,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  is_cover boolean NOT NULL DEFAULT false,
  CONSTRAINT item_media_pkey PRIMARY KEY (id),
  CONSTRAINT item_media_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
  CONSTRAINT item_media_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT item_media_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  status text NOT NULL DEFAULT 'draft'::text,
  item_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  last_edited_by uuid,
  CONSTRAINT items_pkey PRIMARY KEY (id),
  CONSTRAINT items_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id),
  CONSTRAINT items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT items_last_edited_by_fkey FOREIGN KEY (last_edited_by) REFERENCES auth.users(id)
);
CREATE TABLE public.user_filter_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  page text NOT NULL,
  filter_config jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_filter_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_filter_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);