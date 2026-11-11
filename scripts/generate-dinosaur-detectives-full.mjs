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

Each print was wider than Theo’s backpack. Broken ferns marked the trail, and something had nibbled every leaf from the lowest branches.

Maya wrote down their clues.

“Three toes, very tall, and hungry for leaves.”

“Perhaps it’s a gentle dinosaur,” Theo said.

A deep rumble rolled through the forest.

“Or perhaps not,” Maya replied.

They followed the sound to a clearing surrounded by ancient trees. In the centre stood a huge green creature with a neck stretching high into the branches.

Theo gasped. “A real dinosaur!”

The creature turned toward them and sneezed.

Leaves flew everywhere.

Maya noticed something caught around its ankle: a long piece of silver ribbon from the town’s science fair.

“It didn’t come from the past,” she said. “It escaped from somewhere nearby.”

The dinosaur tried to walk, but the ribbon tightened around its foot.

“It needs our help,” said Theo.

Moving slowly, the detectives approached. Theo offered the dinosaur a handful of leaves while Maya carefully loosened the ribbon.

The dinosaur gave a happy rumble and lowered its enormous head.

Around its neck hung a small tag.

“Fernwood Museum,” Maya read. “Experimental robotic dinosaur.”

Theo tapped its green skin. Beneath it, he heard a quiet metallic click.

“So it isn’t a real dinosaur?”

The robot chirped and gently nudged his shoulder.

“It’s real enough to need rescuing,” Maya said.

They followed its footprints back through the forest until they reached the museum’s outdoor laboratory. A worried scientist hurried through the gate.

“There you are!” she cried. “The storm opened the enclosure last night.”

Maya returned the silver ribbon, and Theo explained how they had followed the clues.

The scientist presented them with two golden Junior Detective badges.

As Maya pinned hers to her jacket, another roar echoed beyond the trees.

Theo looked at her.

“Another robot?”

Maya opened her notebook.

“There’s only one way to find out.”
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
  "generated-audio/dinosaur-detectives-full.mp3";

const audio = Buffer.from(await response.arrayBuffer());
await writeFile(outputPath, audio);

console.log(`Created ${outputPath}`);