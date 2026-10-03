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

Pip looked up, but he saw only silver leaves dancing in the breeze.

“Waiting for me to do what?”

The glowing berry floated into the air and drifted along the path. Pip followed it between the trees.

Soon, he reached a stream that had stopped flowing. The water stood perfectly still, and the little fish beneath its surface could not swim home.

A family of rabbits waited on the opposite bank.

“The stepping stones disappeared,” one rabbit explained. “The woods have forgotten where to put them.”

Pip held the glowing berry over the stream.

Its light revealed a row of stones hidden beneath the water.

The rabbits crossed safely, and the stream began to flow again.

The berry continued deeper into the woods.

Next, Pip found a young owl sitting beneath an empty nest.

“The wind moved my tree,” she said. “Now I cannot find my family.”

Pip listened carefully.

Far away, through the rustling leaves, he heard an owl calling three soft notes.

He followed the sound until the silver trees opened a new path. At its end, the owl’s family waited in a crooked pine.

The young owl flew home, and the cloudberries surrounding the tree began to glow.

At last, Pip reached the heart of the forest.

The ancient oak stood there, but its silver leaves had turned grey.

“The woods are losing their light,” the voice said. “They needed someone small enough to notice the things others passed by.”

Pip placed the glowing berry between the oak’s roots.

Golden light travelled through the ground. One by one, the leaves brightened, the paths returned, and thousands of cloudberries shone like tiny moons.

The ancient oak lowered a branch and placed one silver leaf behind Pip’s ear.

“Will the woods always remember their way now?” Pip asked.

“Forests sometimes become lost,” the voice replied. “Just like everyone else.”

The wind stirred the leaves, opening a path toward home.

“But now,” said the oak, “Cloudberry Woods has you to help it remember.”

Pip followed the glowing path home, while tiny bells rang softly behind him.
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
      model_id: "eleven_flash_v2_5",
    }),
  },
);

if (!response.ok) {
  const errorMessage = await response.text();
  throw new Error(`ElevenLabs request failed: ${errorMessage}`);
}

await mkdir("generated-audio", { recursive: true });

const outputPath =
  "generated-audio/cloudberry-woods-full.mp3";

const audio = Buffer.from(await response.arrayBuffer());
await writeFile(outputPath, audio);

console.log(`Created ${outputPath}`);