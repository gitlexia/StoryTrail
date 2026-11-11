import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_CLOUDBERRY_VOICE_ID;

if (!apiKey || !voiceId) {
  throw new Error(
    "ELEVENLABS_API_KEY and ELEVENLABS_CLOUDBERRY_VOICE_ID must be set in .env.local",
  );
}

const narration = `
At the edge of Cloudberry Woods, the trees grew soft silver leaves, and the paths changed whenever the wind blew.

One quiet morning, a little fox named Pip discovered a glowing berry beneath an ancient oak.

When he touched it, tiny bells rang throughout the forest.

Then a gentle voice drifted down from the branches.

“The woods have been waiting for you, Pip.”
`.trim();

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text: narration,
      model_id: "eleven_multilingual_v2",
    }),
  },
);

if (!response.ok) {
  const errorMessage = await response.text();
  throw new Error(`ElevenLabs request failed: ${errorMessage}`);
}

await mkdir("generated-audio", { recursive: true });

const outputPath =
  "generated-audio/cloudberry-woods-preview.mp3";

const audio = Buffer.from(await response.arrayBuffer());
await writeFile(outputPath, audio);

console.log(`Created ${outputPath}`);