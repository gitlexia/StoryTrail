import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;

if (!apiKey || !voiceId) {
  throw new Error(
    "Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local",
  );
}

const storyText = `
Every night, after the music shop closed, a tiny orchestra climbed out of the instrument cases.

Mina the mouse raised her silver baton. “Ready?”

The cricket violinists tuned their strings. A beetle tapped the smallest drum, and two fireflies floated above the stage like golden spotlights.

But just as the concert began, Pip the piccolo bird lost his first note.

The orchestra searched beneath the chairs and inside the piano. At last, Mina heard a tiny whistle hiding inside a seashell.

Pip took a deep breath, and the missing note flew back into the melody.

Together, the tiny orchestra played until the moon disappeared and morning filled the windows.
`.trim();

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: storyText,
      model_id: "eleven_multilingual_v2",
    }),
  },
);

if (!response.ok) {
  const errorMessage = await response.text();
  throw new Error(`ElevenLabs request failed: ${errorMessage}`);
}

const audio = Buffer.from(await response.arrayBuffer());

await mkdir("generated-audio", { recursive: true });
await writeFile("generated-audio/tiny-orchestra-preview.mp3", audio);

console.log("Created generated-audio/tiny-orchestra-preview.mp3");