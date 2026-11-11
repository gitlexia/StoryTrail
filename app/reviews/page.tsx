import type { Metadata } from "next";
import Link from "next/link";
import EditorialShell from "@/components/editorial-shell";
import styles from "./reviews.module.css";

export const metadata: Metadata = {
  title: "Reviews | StoryTrail",
  description: "Browse StoryTrail reviews by story, from bedtime listening to family road trips.",
};

const reviews = [
  ["Sarah M.", 5, "Absolute lifesaver for bedtime. Our 5-year-old used to fight sleep every single night, but putting on Moss and the Mountain completely calms him down. The ambient sound design is so soft. 10/10 recommend to any exhausted parents out there."],
  ['Dave "TechDad" K.', 5, "Great selection of stories! My daughter is obsessed with space right now so Postcards from Saturn is played on loop in our house. She’s learned so much about the planets while falling asleep. Only giving 5 stars because it actually works to keep her quiet during long car rides too haha."],
  ["michele_b", 4, "the app is good. my kids like The Clockwork Sparrow and Dinosaur Detectives before bed. wish there were a few more free options but the subscription is worth it honestly for how much peace and quiet we get in the evenings."],
  ["Marcus Vance", 5, "UNBELIEVABLE APP. The Midnight Bakery is officially part of our nightly routine. My twin boys ask for it every single night without fail. If you’re on the fence just download it."],
  ["Elena Rostova", 5, "As a music teacher, I am so picky about what audio content my kids listen to. The Tiny Orchestra and The Museum of Small Sounds are pure magic. Beautifully arranged instruments and subtle story arcs. Fantastic quality!"],
  ["Jason P", 3, "stories are cute (especially Cloudberry Woods and A Home for the Wind), but the interface can be a bit laggy on older iPads. content is 5 stars, performance is 3. fixing the load time would make this perfect."],
  ["Chloe & Tim", 5, "we use this every single night!! The Lantern Whale is literally magic... my 4yo falls asleep before it even finishes. thank you to whoever made this app 😭❤️"],
  ['Brian "B-Dog" S.', 5, "The Train to Tomorrow has saved our sanity on family road trips. Kept both my 6 and 8 year olds completely engaged for a full hour. No fighting, no screen addiction, just listening."],
  ["Jessica Miller", 4, "Really sweet stories. The Rainy Day Band is a huge hit when stuck inside on rainy afternoons. Only taking off one star because I wish I could create custom playlists of stories to play back-to-back."],
  ["Auntie Jen", 5, "Bought this subscription for my nephew’s 6th birthday and my sister calls me weekly to thank me 😂 He loves The Library Under the Lake!"],
  ["gregory_h92", 5, "Moon Garden hits different at 8pm after a 10-hour workday. Kid is asleep in 10 minutes. I’m almost asleep in 10 minutes. 5 stars."],
  ["Priya Sharma", 5, "The Coral Classroom made my daughter so curious about sea turtles and marine life! Love that the Learn & Wonder section balances fun storytelling with real educational takeaways. Beautifully narrated."],
] as const;

export default function ReviewsPage() {
  return (
    <EditorialShell>
      <section className={styles.page} aria-labelledby="reviews-title">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>StoryTrail reviews</p>
          <h1 id="reviews-title">Little listeners.<br />Big opinions.</h1>
          <p>From lights out to long drives, find out which stories are getting another listen.</p>
        </div>
        <div className={styles.grid}>
          {reviews.map(([name, rating, review]) => (
            <article className={styles.card} key={name} aria-label={`Review by ${name}`}>
              <div className={styles.byline}>
                <p>{name}</p>
                <span className={styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
                  {"★".repeat(rating)}{"☆".repeat(5 - rating)}
                </span>
              </div>
              <p className={styles.review}>{review}</p>
            </article>
          ))}
        </div>
        <Link className={styles.cta} href="/stories">Find a story to listen to →</Link>
      </section>
    </EditorialShell>
  );
}
