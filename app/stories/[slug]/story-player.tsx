"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./story-player.module.css";

type Track = "preview" | "full";
type Props = { slug: string; title: string; previewUrl: string | null; canPlayFull: boolean };
type Signed = { url: string; expiresAt: number };

function time(seconds: number) {
  const whole = Math.floor(Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

async function fetchFull(slug: string, signal?: AbortSignal): Promise<Signed> {
  const response = await fetch(`/api/stories/${slug}/audio`, { method: "POST", signal, cache: "no-store" });
  const result = await response.json() as { signedUrl?: string; error?: string };
  if (!response.ok || !result.signedUrl) throw new Error(result.error ?? "Could not load the full recording.");
  return { url: result.signedUrl, expiresAt: Date.now() + 14 * 60_000 };
}

export default function StoryPlayer({ slug, title, previewUrl, canPlayFull }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const signed = useRef<Signed | null>(null);
  const selection = useRef({ revision: 0 });
  const [track, setTrack] = useState<Track>(previewUrl ? "preview" : "full");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(canPlayFull);
  const [message, setMessage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && previewUrl) audio.src = previewUrl;
    if (!canPlayFull) return;
    const controller = new AbortController();
    void fetchFull(slug, controller.signal).then(result => {
      if (!controller.signal.aborted) signed.current = result;
    }).catch(() => {
      // Keep the full-story button available so the listener can retry.
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    const marker = selection.current;
    return () => { controller.abort(); marker.revision++; };
  }, [slug, canPlayFull, previewUrl]);

  async function play(next: Track, toggle = false) {
    const audio = audioRef.current;
    if (!audio) return;
    const intent = ++selection.current.revision;
    setMessage("");
    let url = previewUrl;
    try {
      if (next === "full") {
        if (!canPlayFull) return;
        if (!signed.current || signed.current.expiresAt <= Date.now()) {
          setLoading(true);
          signed.current = await fetchFull(slug);
        }
        url = signed.current.url;
      }
      if (!url || intent !== selection.current.revision) return;
      if (audio.getAttribute("src") !== url) {
        audio.pause();
        audio.src = url;
        setElapsed(0);
        setDuration(0);
        setTrack(next);
      } else if (toggle && !audio.paused) {
        audio.pause();
        return;
      }
      await audio.play();
    } catch (error) {
      if (intent !== selection.current.revision) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage(error instanceof DOMException && error.name === "NotAllowedError"
        ? "Recording ready. Press play to listen."
        : error instanceof Error ? error.message : "Could not play this recording.");
    } finally {
      if (next === "full") setLoading(false);
    }
  }

  return <section className={styles.player} aria-label={`${title} player`}>
    <div className={styles.trackButtons}>
      {previewUrl && <button type="button" className={`${styles.trackButton} ${track === "preview" ? styles.activeTrack : ""}`} onClick={() => void play("preview")}>Play preview</button>}
      {canPlayFull && <button type="button" className={`${styles.trackButton} ${track === "full" ? styles.activeTrack : ""}`} disabled={loading} onClick={() => void play("full")}>{loading ? "Preparing full story…" : "Play full story"}</button>}
    </div>
    <div className={styles.controls}>
      <button type="button" className={styles.playButton} disabled={track === "full" && loading} onClick={() => void play(track, true)} aria-label={playing ? `Pause ${title}` : `Play ${title}`}>
        {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
      </button>
      <div className={styles.playback}>
        <span className={styles.trackLabel}>{track === "full" ? "Full story" : "Story preview"}</span>
        <div className={styles.progressRow}>
          <input className={styles.seek} type="range" aria-label="Playback position" min={0} max={duration || 1} step={0.1} value={Math.min(elapsed, duration)} disabled={!duration} onChange={event => {
            const position = Number(event.target.value);
            if (audioRef.current) audioRef.current.currentTime = position;
            setElapsed(position);
          }} />
          <span className={styles.time}>{time(elapsed)} / {time(duration)}</span>
        </div>
      </div>
    </div>
    {message && <p className={styles.message} role="status">{message}</p>}
    <audio ref={audioRef} preload="metadata"
      onPlaying={() => { setPlaying(true); setMessage(""); }}
      onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); if (track === "full") signed.current = null; setMessage("This recording couldn’t load. Try playing it again."); }}
      onDurationChange={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
      onTimeUpdate={event => setElapsed(event.currentTarget.currentTime)}
      onEnded={event => { event.currentTarget.currentTime = 0; setElapsed(0); setPlaying(false); }}
    />
  </section>;
}
