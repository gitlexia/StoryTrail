insert into public.stories (
  slug,
  title,
  description,
  creator,
  category,
  age_min,
  age_max,
  duration_seconds,
  access_level,
  is_featured,
  is_published
)
values
  (
    'moon-garden',
    'Moon Garden',
    'A gentle nighttime journey through a garden that blooms beneath the stars.',
    'StoryTrail Studio',
    'bedtime',
    5,
    8,
    1080,
    'free',
    true,
    true
  ),
  (
    'the-tiny-orchestra',
    'The Tiny Orchestra',
    'Meet a miniature orchestra and discover how every instrument adds something special.',
    'StoryTrail Studio',
    'music',
    4,
    7,
    720,
    'free',
    false,
    true
  ),
  (
    'dinosaur-detectives',
    'Dinosaur Detectives',
    'Follow a trail of enormous footprints and uncover the secrets of a prehistoric mystery.',
    'StoryTrail Studio',
    'adventure',
    6,
    9,
    1320,
    'premium',
    true,
    true
  ),
  (
    'cloudberry-woods',
    'Cloudberry Woods',
    'Wander into a curious woodland where animals share stories about the changing seasons.',
    'StoryTrail Studio',
    'learning',
    3,
    6,
    540,
    'premium',
    false,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  creator = excluded.creator,
  category = excluded.category,
  age_min = excluded.age_min,
  age_max = excluded.age_max,
  duration_seconds = excluded.duration_seconds,
  access_level = excluded.access_level,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  updated_at = now();