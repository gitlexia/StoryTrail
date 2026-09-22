create table public.listener_profiles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade
    default auth.uid(),

  name text not null
    check (char_length(trim(name)) between 1 and 40),

  age_band text not null
    check (age_band in ('3-5', '6-8', '9-12')),

  avatar text not null default 'moon',

  interests text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listener_profiles_user_id_idx
  on public.listener_profiles(user_id);

alter table public.listener_profiles enable row level security;

revoke all on table public.listener_profiles from anon;

grant select, insert, update, delete
  on table public.listener_profiles
  to authenticated;

create policy "Users can view their own listener profiles"
  on public.listener_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own listener profiles"
  on public.listener_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own listener profiles"
  on public.listener_profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own listener profiles"
  on public.listener_profiles
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);