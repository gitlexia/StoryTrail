export const featured = [
  { title: "Moon Garden", slug: "moon-garden", subtitle: "The silver seed", category: "Bedtime", ages: "5–8", tone: "moon", previewPath: "moon-garden/preview.mp3", description: "A silver seed leads to a garden that only wakes when the moon comes out." },
  { title: "The Tiny Orchestra", slug: "the-tiny-orchestra", subtitle: "A very small symphony", category: "Music", ages: "4–7", tone: "music", previewPath: "tiny-orchestra/preview.mp3", description: "Mina the mouse must find a missing note before the tiniest orchestra in the world can play." },
  { title: "Dinosaur Detectives", slug: "dinosaur-detectives", subtitle: "The mysterious footprint", category: "Adventures", ages: "6–9", tone: "dino", previewPath: "dinosaur-detectives/preview.mp3", description: "Two young detectives follow the clues left behind by a giant footprint." },
  { title: "Cloudberry Woods", slug: "cloudberry-woods", subtitle: "The glowing berry", category: "Learn & wonder", ages: "3–6", tone: "woods", previewPath: "cloudberry-woods/preview.mp3", description: "Follow a little fox into a woodland where a glowing berry can show the way home." },
].map((story, index) => ({ ...story, premium: index >= 2, eyebrow: `Ages ${story.ages}` }));

const plus = [
  ["the-lantern-whale","The Lantern Whale","Bedtime","4–8","A whale with a warm light guides a lost boat through the dark."],
  ["the-clockwork-sparrow","The Clockwork Sparrow","Adventures","6–9","A tiny mechanical bird discovers the one thing its maker forgot."],
  ["postcards-from-saturn","Postcards from Saturn","Learn & wonder","6–10","A young astronaut sends home a letter from the edge of Saturn’s rings."],
  ["the-rainy-day-band","The Rainy Day Band","Music","4–8","A rainy afternoon becomes a concert made from the sounds of an ordinary kitchen."],
  ["the-library-under-the-lake","The Library Under the Lake","Adventures","6–10","A borrowed book leads to a library where even the fish are regular readers."],
  ["moss-and-the-mountain","Moss and the Mountain","Bedtime","4–8","A little goat learns how to find a path by slowing down and listening."],
  ["the-museum-of-small-sounds","The Museum of Small Sounds","Music","5–9","A museum collects the tiny sounds people forget to notice."],
  ["a-home-for-the-wind","A Home for the Wind","Learn & wonder","5–9","A kite maker tries to give the wind somewhere to stay."],
  ["the-midnight-bakery","The Midnight Bakery","Bedtime","4–8","A rabbit baker makes a loaf for a guest who arrives much later than expected."],
  ["the-coral-classroom","The Coral Classroom","Learn & wonder","5–9","A seahorse learns what a reef needs by helping its smallest neighbours."],
  ["the-train-to-tomorrow","The Train to Tomorrow","Adventures","6–10","A train conductor gives a worried traveller a ticket for one small step into tomorrow."],
].map(([slug,title,category,ages,description]) => ({ slug,title,category,ages,description,premium:true,previewPath:null }));

export const catalogue = [...featured, ...plus];
export const storyCover = (slug: string) => `/story-covers/${slug}.webp`;
