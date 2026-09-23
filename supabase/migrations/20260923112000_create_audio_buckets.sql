insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'story-previews',
    'story-previews',
    true,
    10485760,
    array['audio/mpeg', 'audio/mp4', 'audio/wav']
  ),
  (
    'story-audio',
    'story-audio',
    false,
    52428800,
    array['audio/mpeg', 'audio/mp4', 'audio/wav']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;