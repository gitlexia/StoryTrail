import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const directory = process.argv[2];
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!directory || !url || !key) throw new Error("Usage: node --env-file=.env.local scripts/upload-storytrail-audio.mjs /path/to/narrated-audio");

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = "story-audio";
const { data: settings, error: settingsError } = await supabase.storage.getBucket(bucket);
if (settingsError || settings?.public !== false) throw new Error("The story-audio bucket must exist and be private.");

const slugs = [
  "the-lantern-whale", "the-clockwork-sparrow", "postcards-from-saturn", "the-rainy-day-band",
  "the-library-under-the-lake", "moss-and-the-mountain", "the-museum-of-small-sounds",
  "a-home-for-the-wind", "the-midnight-bakery", "the-coral-classroom", "the-train-to-tomorrow",
];
const recordings = await Promise.all(slugs.map(async slug => {
  const path = `${slug}/full.mp3`;
  return { path, audio: await readFile(join(directory, path)) };
}));
for (const { path, audio } of recordings) {
  const { error } = await supabase.storage.from(bucket).upload(path, audio, {
    contentType: "audio/mpeg", upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
  console.log(`Uploaded ${path}`);
}
