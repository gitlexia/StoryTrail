import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StoryPlayer from "./story-player";
import styles from "./story.module.css";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

export default async function StoryPage({
  params,
}: StoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select(
      `
        slug,
        title,
        description,
        creator,
        category,
        age_min,
        age_max,
        duration_seconds,
        access_level,
        preview_path
      `,
    )
    .eq("slug", slug)
    .single();

  if (error || !story || !story.preview_path) {
    notFound();
  }

  const { data: previewData } = supabase.storage
    .from("story-previews")
    .getPublicUrl(story.preview_path);

  const previewUrl = previewData.publicUrl;

  return (
    <main className={styles.page}>
      <nav className={styles.navigation}>
        <Link className={styles.logo} href="/">
          StoryTrail
        </Link>

        <Link className={styles.backLink} href="/#stories">
          Back to stories
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.cover} aria-hidden="true">
          {story.category === "music"
            ? "♫"
            : story.category === "adventure"
              ? "✦"
              : story.category === "learning"
                ? "♧"
                : "☾"}
        </div>

        <div className={styles.details}>
          <p className={styles.eyebrow}>
            {story.category} · Ages {story.age_min}–{story.age_max}
          </p>

          <h1>{story.title}</h1>

          <p className={styles.description}>{story.description}</p>

          <div className={styles.metadata}>
            <span>{formatDuration(story.duration_seconds)}</span>
            <span>By {story.creator}</span>
            <span>
              {story.access_level === "premium"
                ? "StoryTrail Plus"
                : "Free story"}
            </span>
          </div>

          <div className={styles.preview}>
            <p>Listen now</p>

            <StoryPlayer
              slug={story.slug}
              title={story.title}
              previewUrl={previewUrl}
              premium={story.access_level === "premium"}
            />
          </div>
        </div>
      </section>
    </main>
  );
}