import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hasPlus } from "@/lib/plus";
import { catalogue, storyCover } from "@/lib/catalogue";
import EditorialShell from "@/components/editorial-shell";
import StoryPlayer from "./story-player";
import styles from "../discovery.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const match = catalogue.find(item => item.slug === slug);
  return match ? { title: `${match.title} | StoryTrail`, description: match.description } : { title: "Story not found | StoryTrail" };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = catalogue.find(item => item.slug === slug);
  if (!story) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let canPlayFull = Boolean(user && !story.premium);
  let unavailable = false;
  if (user && story.premium) {
    try { canPlayFull = await hasPlus(user.id); }
    catch { unavailable = true; }
  }

  const previewUrl = story.previewPath
    ? supabase.storage.from("story-previews").getPublicUrl(story.previewPath).data.publicUrl
    : null;

  return <EditorialShell><section className={`${styles.wrap} ${styles.hero}`}>
    <div className={styles.art}><Image src={storyCover(slug)} fill alt="" priority sizes="(max-width: 820px) 100vw, 45vw" /></div>
    <div>
      <Link className={styles.secondary} href="/stories">← All stories</Link>
      <p className={styles.kicker}>{story.category} · Ages {story.ages} · {story.premium ? "StoryTrail Plus" : "Free story"}</p>
      <h1>{story.title}</h1>
      <p className={styles.lead}>{story.description}</p>
      {(previewUrl || canPlayFull) && <StoryPlayer key={slug} slug={slug} title={story.title} previewUrl={previewUrl} canPlayFull={canPlayFull} />}
      {!canPlayFull && <div className={styles.actions}>
        {unavailable ? <p role="status">We couldn’t check your membership. Refresh to try again.</p> :
          !user ? <Link className={styles.button} href={`/auth?next=${encodeURIComponent(`/stories/${slug}`)}`}><LockKeyhole size={16} aria-hidden="true" />Sign in to listen</Link> :
          <Link className={styles.button} href="/membership"><LockKeyhole size={16} aria-hidden="true" />Unlock with StoryTrail Plus</Link>}
        {story.premium && !user && <Link className={styles.secondary} href="/membership">See Plus plans</Link>}
      </div>}
    </div>
  </section></EditorialShell>;
}
