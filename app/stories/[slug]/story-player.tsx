"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./story-player.module.css";

type StoryPlayerProps = {
  slug: string;
  title: string;
  previewUrl: string;
  premium: boolean;
};

type Track = "preview" | "full";

export default function StoryPlayer({
  slug,
  title,
  previewUrl,
  premium,
}: StoryPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [track, setTrack] = useState<Track>("preview");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullAudioUrl, setFullAudioUrl] = useState("");
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load the preview when the player first appears.
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.src = previewUrl;
    audio.load();

    setTrack("preview");
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
  }, [previewUrl]);

  // Prepare free full stories before the user presses play.
  useEffect(() => {
    if (premium) return;

    const controller = new AbortController();
    let cancelled = false;

    async function prepareFullStory() {
      setLoading(true);

      try {
        const response = await fetch(`/api/stories/${slug}/audio`, {
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const result = (await response.json()) as {
          signedUrl?: string;
        };

        if (!cancelled && result.signedUrl) {
          setFullAudioUrl(result.signedUrl);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Unable to prepare full story:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void prepareFullStory();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug, premium]);

  async function loadFullStory() {
    if (fullAudioUrl) {
      return fullAudioUrl;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/stories/${slug}/audio`, {
        method: "POST",
      });

      if (response.status === 401) {
        window.location.href = `/auth?next=/stories/${slug}`;
        return "";
      }

      const result = (await response.json()) as {
        signedUrl?: string;
        error?: string;
      };

      if (!response.ok || !result.signedUrl) {
        setMessage(
          response.status === 403
            ? "This story requires a Plus membership."
            : result.error ?? "The full story could not be loaded.",
        );

        return "";
      }

      setFullAudioUrl(result.signedUrl);
      return result.signedUrl;
    } catch {
      setMessage("The full story could not be loaded.");
      return "";
    } finally {
      setLoading(false);
    }
  }

  async function playTrack(nextTrack: Track) {
    const audio = audioRef.current;

    if (!audio) return;

    setMessage("");

    let nextUrl = previewUrl;

    if (nextTrack === "full") {
      const signedUrl = await loadFullStory();

      if (!signedUrl) return;

      nextUrl = signedUrl;
    }

    if (audio.src !== nextUrl) {
      audio.pause();
      audio.src = nextUrl;
      audio.currentTime = 0;
      audio.load();

      setCurrentTime(0);
      setDuration(0);
    }

    setTrack(nextTrack);

    try {
      await audio.play();
    } catch {
      setPlaying(false);
      setMessage("Playback could not begin. Please try again.");
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) return;

    setMessage("");

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
        setMessage("Playback could not begin. Please try again.");
      }
    } else {
      audio.pause();
    }
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  const progress =
    duration > 0
      ? Math.min((currentTime / duration) * 100, 100)
      : 0;

  return (
    <section
        className={styles.player}
        aria-label={`${title} player`}
    >
        <div className={styles.trackButtons}>
        <button
            className={`${styles.trackButton} ${
            track === "preview" ? styles.activeTrack : ""
            }`}
            type="button"
            aria-pressed={track === "preview"}
            onClick={() => void playTrack("preview")}
        >
            Play preview
        </button>

        <button
            className={`${styles.trackButton} ${
            track === "full" ? styles.activeTrack : ""
            }`}
            type="button"
            aria-pressed={track === "full"}
            onClick={() => void playTrack("full")}
            disabled={loading}
        >
            {loading
            ? "Preparing full story…"
            : premium
                ? "Unlock full story"
                : "Play full story"}
        </button>
        </div>

        <div className={styles.controls}>
        <button
            className={styles.playButton}
            type="button"
            onClick={() => void togglePlayback()}
            aria-label={
            playing ? `Pause ${title}` : `Play ${title}`
            }
        >
            {playing ? (
            <Pause size={22} fill="currentColor" />
            ) : (
            <Play size={22} fill="currentColor" />
            )}
        </button>

        <div className={styles.playback}>
            <span className={styles.trackLabel}>
            {track === "full" ? "Full story" : "Story preview"}
            </span>

            <div className={styles.progressRow}>
            <div
                className={styles.progressTrack}
                role="progressbar"
                aria-label="Playback progress"
                aria-valuemin={0}
                aria-valuemax={duration || 0}
                aria-valuenow={currentTime}
            >
                <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
                />
            </div>

            <span className={styles.time}>
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            </div>
        </div>
        </div>

        {message && (
        <p className={styles.message} role="alert">
            {message}
        </p>
        )}

        <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration);
        }}
        onDurationChange={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) {
            setDuration(event.currentTarget.duration);
            }
        }}
        onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
        }}
        onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            setPlaying(false);
            setCurrentTime(0);
        }}
        />
    </section>
    );
}