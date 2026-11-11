import { mkdir, writeFile } from "node:fs/promises";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;

if (!apiKey || !voiceId) {
  throw new Error(
    "Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local",
  );
}

const storyTextFull = `
Deep beneath the floorboards of an old music hall lived the tiniest orchestra in the world.

Every night, after the music shop closed, the musicians climbed out of the instrument cases.

Mina the mouse stepped onto a matchbox and raised her silver baton.

“Ready?”

The cricket violinists tuned their strings. Theo the beetle tapped the smallest drum, and two fireflies floated above the stage like golden spotlights.

Pip, a little brown bird, lifted his silver piccolo.

Mina counted silently.

One. Two. Three.

The violins began a soft, dancing melody. Theo joined with a gentle rhythm. Then Mina pointed her baton toward Pip.

It was time for his solo.

Pip took a breath and played.

But no sound came out.

He tried again.

Nothing.

“I’ve lost my first note,” he whispered.

The orchestra searched beneath the chairs and inside the piano. The crickets climbed between its golden strings while the fireflies illuminated every dusty corner.

Mina and Pip searched inside a trumpet, an old conductor’s coat, and a cello case lined with red velvet.

“What did your note sound like?” Mina asked.

“It was bright,” Pip said. “It sounded like morning.”

Then Theo tapped the enormous bass drum.

Boom!

A tower of sheet music tumbled to the floor.

From underneath the fallen pages came a tiny whistle.

The orchestra uncovered a pale seashell.

“That’s my note!” Pip cried.

Mina listened carefully.

“It sounds frightened.”

Pip held the shell close.

“Why did you hide?”

A tiny voice answered, “I was afraid I would come out wrong.”

Pip remembered how hard he had tried to play perfectly.

“I don’t need you to be perfect,” he said. “I only need you to be mine.”

He took one slow breath.

The note floated from the shell, circled him in the moonlight, and slipped gently back into his piccolo.

The orchestra hurried to the stage.

Mina raised her baton, and the concert began again.

This time, Pip’s first note trembled—but the next opened like a window at sunrise.

The violins joined it. The acorn drums filled the room with rhythm, and the fireflies shone brighter than ever.

Together, the tiny orchestra played until the moon disappeared and morning filled the windows.

“Was it perfect?” Pip asked.

Mina smiled.

“No,” she said. “It was better. It was ours.”
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
      text: storyTextFull,
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
await writeFile("generated-audio/tiny-orchestra-full.mp3", audio);

console.log("Created generated-audio/tiny-orchestra-full.mp3");