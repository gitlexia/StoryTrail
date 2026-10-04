"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Headphones,
  Heart,
  LockKeyhole,
  Menu,
  Pause,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import AuthNavLink from "@/components/auth-nav-link";
import Link from "next/link";

const stories = [
  {
    title: "Moon Garden",
    slug: "moon-garden",
    subtitle: "The silver seed",
    eyebrow: "Ages 5–8 · 18 min",
    category: "Bedtime",
    premium: false,
    tone: "moon",
    symbol: "☾",
    previewPath: "moon-garden/preview.mp3",
  },
  {
    title: "The Tiny Orchestra",
    slug: "the-tiny-orchestra",
    subtitle: "A very small symphony",
    eyebrow: "Ages 4–7 · 12 min",
    category: "Music",
    premium: false,
    tone: "music",
    symbol: "♫",
    previewPath: "tiny-orchestra/preview.mp3",
  },
  {
    title: "Dinosaur Detectives",
    slug: "dinosaur-detectives",
    subtitle: "The mysterious footprint",
    eyebrow: "Ages 6–9 · 22 min",
    category: "Adventures",
    premium: true,
    tone: "dino",
    symbol: "✦",
    previewPath: "dinosaur-detectives/preview.mp3",
  },
  {
    title: "Cloudberry Woods",
    slug: "cloudberry-woods",
    subtitle: "The glowing berry",
    eyebrow: "Ages 3–6 · 9 min",
    category: "Learn & wonder",
    premium: true,
    tone: "woods",
    symbol: "♧",
    previewPath: "cloudberry-woods/preview.mp3",
  },
];

const filters = [
  "For you",
  "Bedtime",
  "Adventures",
  "Learn & wonder",
  "Music",
] as const;

type Filter = (typeof filters)[number];
type Story = (typeof stories)[number];

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [activeStory, setActiveStory] = useState<Story>(stories[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] =
  useState<Filter>("For you");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playbackMode, setPlaybackMode] =
    useState<"preview" | "full">("preview");
  const [fullStoryLoading, setFullStoryLoading] =
    useState(false);
  const [playerMessage, setPlayerMessage] = useState("");

  const previewAudio = useRef<HTMLAudioElement>(null);
  const filteredStories = stories.filter((story) => {
    const matchesCategory =
      activeFilter === "For you" ||
      story.category === activeFilter;

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const matchesSearch =
      normalizedSearch === "" ||
      story.title.toLowerCase().includes(normalizedSearch) ||
      story.subtitle.toLowerCase().includes(normalizedSearch) ||
      story.category.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  function getPreviewUrl(previewPath: string) {
    return (
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/` +
      `story-previews/${previewPath}`
    );
  }

  function isStoryPlaying(story: Story) {
    return (
      activeStory.slug === story.slug &&
      playbackMode === "preview" &&
      playing
    );
  }

  async function toggleStoryPreview(story: Story) {
    const audio = previewAudio.current;

    if (!audio) return;

    setPlayerVisible(true);

    const isSelectedStory =
      activeStory.slug === story.slug &&
      playbackMode === "preview";

    if (!isSelectedStory) {
      audio.pause();
      setPlaybackMode("preview");
      setPlayerMessage("");

      setActiveStory(story);
      setCurrentTime(0);
      setDuration(0);

      audio.src = getPreviewUrl(story.previewPath);
      audio.load();

      try {
        await audio.play();
      } catch (error) {
        console.error("Unable to play preview:", error);
        setPlaying(false);
      }

      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Unable to play preview:", error);
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  async function toggleCurrentPlayback() {
    const audio = previewAudio.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Unable to play audio:", error);
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  async function playFullStory(story: Story) {
    const audio = previewAudio.current;

    if (!audio) return;

    setFullStoryLoading(true);
    setPlayerMessage("");
    setPlayerVisible(true);

    try {
      const response = await fetch(
        `/api/stories/${story.slug}/audio`,
        {
          method: "POST",
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/auth";
        return;
      }

      if (!response.ok) {
        setPlayerMessage(
          result.error ?? "Unable to load the full story.",
        );
        return;
      }

      audio.pause();

      setActiveStory(story);
      setPlaybackMode("full");
      setCurrentTime(0);
      setDuration(0);

      audio.src = result.signedUrl;
      audio.load();

      await audio.play();
    } catch (error) {
      console.error("Unable to load full story:", error);
      setPlayerMessage(
        "Something went wrong while loading the full story.",
      );
    } finally {
      setFullStoryLoading(false);
    }
  }

  function handlePreviewEnded() {
    const audio = previewAudio.current;

    setPlaying(false);
    setCurrentTime(0);

    if (audio) {
      audio.currentTime = 0;
    }
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  function toggleLike(title: string) {
    setLiked((items) =>
      items.includes(title)
        ? items.filter((item) => item !== title)
        : [...items, title],
    );
  }

  const progressPercentage =
    duration > 0
      ? Math.min((currentTime / duration) * 100, 100)
      : 0;

  const moonGarden = stories[0];
  const tinyOrchestra = stories[1];

  const moonGardenPlaying = isStoryPlaying(moonGarden);
  const tinyOrchestraPlaying = isStoryPlaying(tinyOrchestra);

  return (
    <main>
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label="StoryTrail home"
        >
          <span className="brand-mark">S</span>
          StoryTrail
        </a>

        <nav aria-label="Main navigation">
          <Link href="/#stories">Discover</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/#parents">For parents</Link>
        </nav>

        <div className="header-actions">
          {searchOpen && (
            <input
              className="header-search-input"
              type="search"
              value={searchQuery}
              autoFocus
              placeholder="Search stories"
              aria-label="Search stories"
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  document
                    .getElementById("stories")
                    ?.scrollIntoView({ behavior: "smooth" });
                }

                if (event.key === "Escape") {
                  setSearchOpen(false);
                  setSearchQuery("");
                }
              }}
            />
          )}

          <button
            className="icon-button search-button"
            type="button"
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            onClick={() => {
              if (searchOpen) {
                setSearchQuery("");
              }

              setSearchOpen((isOpen) => !isOpen);
            }}
          >
            <Search size={19} />
          </button>

          <AuthNavLink />

          <button
            className="primary-button small"
            type="button"
            onClick={() => void toggleStoryPreview(tinyOrchestra)}
          >
            Start listening
          </button>

          <button
            className="icon-button mobile-menu"
            type="button"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} />
            Audio adventures for curious kids
          </span>

          <h1>
            Big worlds.
            <br />
            <em>Just press play.</em>
          </h1>

          <p>
            Thoughtful stories, music and adventures made for
            screen-free moments—at home or on the move.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() =>
                document
                  .getElementById("stories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore stories <ArrowRight size={18} />
            </button>

            <button
              className="preview-button"
              type="button"
              onClick={() => void toggleStoryPreview(tinyOrchestra)}
            >
              <span>
                {tinyOrchestraPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </span>

              {tinyOrchestraPlaying
                ? "Pause preview"
                : "Hear a preview"}
            </button>
          </div>

          <audio
            ref={previewAudio}
            src={getPreviewUrl(moonGarden.previewPath)}
            preload="metadata"
            onPlay={() => {
              setPlaying(true);
              setPlayerVisible(true);
            }}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(event) =>
              setCurrentTime(event.currentTarget.currentTime)
            }
            onLoadedMetadata={(event) =>
              setDuration(event.currentTarget.duration)
            }
            onDurationChange={(event) =>
              setDuration(event.currentTarget.duration)
            }
            onEnded={handlePreviewEnded}
          />

          <div className="trust-row">
            <span className="avatar-stack">
              <i>R</i>
              <i>M</i>
              <i>A</i>
            </span>

            <span>
              Loved by little listeners
              <br />
              <b>4.9 from parents</b>
            </span>
          </div>
        </div>

        <div
          className="hero-art"
          aria-label="Featured story, Moon Garden"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="moon-shape">☾</div>

          <span className="star s1">✦</span>
          <span className="star s2">·</span>
          <span className="star s3">✧</span>

          <div className="now-playing">
            <button
              type="button"
              onClick={() => void toggleStoryPreview(moonGarden)}
              aria-label={
                moonGardenPlaying
                  ? "Pause Moon Garden"
                  : "Play Moon Garden"
              }
            >
              {moonGardenPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>

            <div>
              <small>TONIGHT&apos;S PICK</small>
              <strong>Moon Garden</strong>
              <span>Chapter 1 · The silver seed</span>
            </div>

            <div
              className={`wave ${
                moonGardenPlaying ? "active" : ""
              }`}
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section id="stories" className="story-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow plain">
              Listen your way
            </span>
            <h2>Find their next favourite</h2>
          </div>

          <button
            className="link-button"
            type="button"
            onClick={() => setActiveFilter("For you")}
          >
            See all stories <ChevronRight size={18} />
          </button>
        </div>

        <div className="filters" aria-label="Story filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "active" : ""}
              type="button"
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="story-grid">
          {filteredStories.map((story) => {
            const storyPlaying = isStoryPlaying(story);

            return (
              <article className="story-card" key={story.title}>
                <div className={`cover ${story.tone}`}>
                  <span>{story.symbol}</span>

                  {story.premium && (
                    <div className="premium">
                      <LockKeyhole size={13} />
                      PLUS
                    </div>
                  )}

                  <button
                    className="card-play"
                    type="button"
                    aria-label={
                      storyPlaying
                        ? `Pause ${story.title}`
                        : `Play ${story.title}`
                    }
                    onClick={() =>
                      void toggleStoryPreview(story)
                    }
                  >
                    {storyPlaying ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                  </button>
                </div>

                <div className="card-meta">
                  <div>
                    <h3>
                      <Link href={`/stories/${story.slug}`}>
                        {story.title}
                      </Link>
                    </h3>
                    <p>{story.eyebrow}</p>
                  </div>
                  <button
                    className={`heart ${
                      liked.includes(story.title)
                        ? "liked"
                        : ""
                    }`}
                    type="button"
                    onClick={() => toggleLike(story.title)}
                    aria-label={`${
                      liked.includes(story.title)
                        ? "Remove"
                        : "Add"
                    } ${story.title} ${
                      liked.includes(story.title)
                        ? "from"
                        : "to"
                    } favourites`}
                  >
                    <Heart
                      size={19}
                      fill={
                        liked.includes(story.title)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {filteredStories.length === 0 && (
          <p className="no-stories-message">
            No stories matched your search.
          </p>
        )}
      </section>

      <section id="parents" className="parent-strip">
        <Headphones size={25} />

        <p>
          <strong>
            Made for small ears. Designed for grown-up peace of
            mind.
          </strong>
          <span>
            Age-aware discovery, calm design and no adverts.
          </span>
        </p>

        <a href="#membership">
          Why families choose us <ArrowRight size={17} />
        </a>
      </section>

      {playerVisible && (
        <div
          className="mini-player"
          role="region"
          aria-label={`${activeStory.title} audio player`}
        >
          <div className={`mini-cover ${activeStory.tone}`}>
            {activeStory.symbol}
          </div>

          <div className="track">
            <strong>{activeStory.title}</strong>

            <span>
              {playbackMode === "full"
                ? "Full story"
                : activeStory.subtitle}
            </span>

            <Link
              className="full-story-button"
              href={`/stories/${activeStory.slug}`}
            >
              View full story
            </Link>

            {playerMessage && (
              <span className="player-message" role="alert">
                {playerMessage}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => void toggleCurrentPlayback()}
            aria-label={
              playing
                ? `Pause ${activeStory.title}`
                : `Play ${activeStory.title}`
            }
          >
            {playing ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>

          <div
            className="progress"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
          >
            <i style={{ width: `${progressPercentage}%` }} />
          </div>

          <span className="time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}
    </main>
  );
}
