import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_DINOSAUR_VOICE_ID;

if (!apiKey || !voiceId) {
  throw new Error(
    "ELEVENLABS_API_KEY and ELEVENLABS_DINOSAUR_VOICE_ID must be set in .env.local",
  );
}

const narration = `
The enormous footprint appeared overnight.

Maya knelt beside it, holding her magnifying glass just above the mud. Three long toes, one broken claw, and a trail leading straight into Fernwood Forest.

“Definitely a dinosaur,” whispered Theo.

A branch snapped beyond the trees.

The two detectives exchanged a nervous glance, gathered their notebooks, and followed the footprints into the mist.
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
  "generated-audio/dinosaur-detectives-preview.mp3";

const audio = Buffer.from(await response.arrayBuffer());
await writeFile(outputPath, audio);

console.log(`Created ${outputPath}`);