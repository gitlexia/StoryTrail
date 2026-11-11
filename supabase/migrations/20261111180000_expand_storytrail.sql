-- Store only the account-to-Stripe mapping. Stripe remains the source of truth for Plus.
create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique
);
alter table public.billing_customers enable row level security;
revoke all on table public.billing_customers from public, anon, authenticated;
grant select, insert, update, delete on table public.billing_customers to service_role;

-- Full recordings always go through the app's access check.
update storage.buckets set public = false where id = 'story-audio';

update public.stories
set access_level = case when slug in ('moon-garden','the-tiny-orchestra') then 'free' else 'premium' end,
    full_audio_path = coalesce(full_audio_path, case slug
      when 'the-tiny-orchestra' then 'tiny-orchestra/full.mp3'
      else slug || '/full.mp3'
    end)
where slug in ('moon-garden','the-tiny-orchestra','dinosaur-detectives','cloudberry-woods');

insert into public.stories (slug,title,description,creator,category,age_min,age_max,duration_seconds,access_level,full_audio_path,is_published)
values
('the-lantern-whale', 'The Lantern Whale', 'A whale with a warm light guides a lost boat through the dark.', 'StoryTrail Studio', 'bedtime', 4, 8, 57, 'premium', 'the-lantern-whale/full.mp3', true),
('the-clockwork-sparrow', 'The Clockwork Sparrow', 'A tiny mechanical bird discovers the one thing its maker forgot.', 'StoryTrail Studio', 'adventure', 6, 9, 64, 'premium', 'the-clockwork-sparrow/full.mp3', true),
('postcards-from-saturn', 'Postcards from Saturn', 'A young astronaut sends home a letter from the edge of Saturn’s rings.', 'StoryTrail Studio', 'learning', 6, 10, 62, 'premium', 'postcards-from-saturn/full.mp3', true),
('the-rainy-day-band', 'The Rainy Day Band', 'A rainy afternoon becomes a concert made from the sounds of an ordinary kitchen.', 'StoryTrail Studio', 'music', 4, 8, 63, 'premium', 'the-rainy-day-band/full.mp3', true),
('the-library-under-the-lake', 'The Library Under the Lake', 'A borrowed book leads to a library where even the fish are regular readers.', 'StoryTrail Studio', 'adventure', 6, 10, 58, 'premium', 'the-library-under-the-lake/full.mp3', true),
('moss-and-the-mountain', 'Moss and the Mountain', 'A little goat learns how to find a path by slowing down and listening.', 'StoryTrail Studio', 'bedtime', 4, 8, 56, 'premium', 'moss-and-the-mountain/full.mp3', true),
('the-museum-of-small-sounds', 'The Museum of Small Sounds', 'A museum collects the tiny sounds people forget to notice.', 'StoryTrail Studio', 'music', 5, 9, 59, 'premium', 'the-museum-of-small-sounds/full.mp3', true),
('a-home-for-the-wind', 'A Home for the Wind', 'A kite maker tries to give the wind somewhere to stay.', 'StoryTrail Studio', 'learning', 5, 9, 52, 'premium', 'a-home-for-the-wind/full.mp3', true),
('the-midnight-bakery', 'The Midnight Bakery', 'A rabbit baker makes a loaf for a guest who arrives much later than expected.', 'StoryTrail Studio', 'bedtime', 4, 8, 59, 'premium', 'the-midnight-bakery/full.mp3', true),
('the-coral-classroom', 'The Coral Classroom', 'A seahorse learns what a reef needs by helping its smallest neighbours.', 'StoryTrail Studio', 'learning', 5, 9, 54, 'premium', 'the-coral-classroom/full.mp3', true),
('the-train-to-tomorrow', 'The Train to Tomorrow', 'A train conductor gives a worried traveller a ticket for one small step into tomorrow.', 'StoryTrail Studio', 'adventure', 6, 10, 55, 'premium', 'the-train-to-tomorrow/full.mp3', true)
on conflict (slug) do update set title = excluded.title, description = excluded.description, category = excluded.category, age_min = excluded.age_min, age_max = excluded.age_max, duration_seconds = excluded.duration_seconds, access_level = excluded.access_level, preview_path = null, full_audio_path = excluded.full_audio_path, is_published = true;
