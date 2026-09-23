create table public.stories (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  title text not null
    check (char_length(trim(title)) between 1 and 100),

  description text not null
    check (char_length(trim(description)) between 1 and 1000),

  creator text not null
    check (char_length(trim(creator)) between 1 and 100),

  category text not null
    check (
      category in (
        'adventure',
        'bedtime',
        'learning',
        'music'
      )
    ),

  age_min integer not null
    check (age_min between 1 and 17),

  age_max integer not null
    check (age_max between age_min and 17),

  duration_seconds integer not null
    check (duration_seconds > 0),

  access_level text not null default 'free'
    check (access_level in ('free', 'premium')),

  cover_path text,
  preview_path text,
  full_audio_path text,

  is_featured boolean not null default false,
  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stories_published_category_idx
  on public.stories(is_published, category);

alter table public.stories enable row level security;

revoke all on table public.stories from anon, authenticated;

grant select
  on table public.stories
  to anon, authenticated;

create policy "Published stories are publicly readable"
  on public.stories
  for select
  to anon, authenticated
  using (is_published = true);