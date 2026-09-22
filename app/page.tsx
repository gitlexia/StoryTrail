"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight, Headphones, Heart, LockKeyhole, Menu, Pause, Play, Search, Sparkles } from "lucide-react";
import AuthNavLink from "@/components/auth-nav-link";

const stories = [
  { title: "Moon Garden", eyebrow: "Ages 5–8 · 18 min", tone: "moon", symbol: "☾" },
  { title: "The Tiny Orchestra", eyebrow: "Ages 4–7 · 12 min", tone: "music", symbol: "♫" },
  { title: "Dinosaur Detectives", eyebrow: "Ages 6–9 · 22 min", tone: "dino", symbol: "✦" },
  { title: "Cloudberry Woods", eyebrow: "Ages 3–6 · 9 min", tone: "woods", symbol: "♧" },
];

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const toggleLike = (title: string) => setLiked((items) => items.includes(title) ? items.filter((item) => item !== title) : [...items, title]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="StoryTrail home"><span className="brand-mark">S</span>StoryTrail</a>
        <nav aria-label="Main navigation"><a href="#stories">Discover</a><a href="#membership">Membership</a><a href="#parents">For parents</a></nav>
        <div className="header-actions"><button className="icon-button search-button" aria-label="Search"><Search size={19}/></button><AuthNavLink /><button className="primary-button small">Start listening</button><button className="icon-button mobile-menu" aria-label="Open menu"><Menu size={22}/></button></div>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15}/> Audio adventures for curious kids</span>
          <h1>Big worlds.<br/><em>Just press play.</em></h1>
          <p>Thoughtful stories, music and adventures made for screen-free moments—at home or on the move.</p>
          <div className="hero-actions"><button className="primary-button">Explore stories <ArrowRight size={18}/></button><button className="preview-button" onClick={() => setPlaying(!playing)}><span>{playing ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}</span>{playing ? "Pause preview" : "Hear a preview"}</button></div>
          <div className="trust-row"><span className="avatar-stack"><i>R</i><i>M</i><i>A</i></span><span>Loved by little listeners<br/><b>4.9 from parents</b></span></div>
        </div>
        <div className="hero-art" aria-label="Featured story, Moon Garden">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="moon-shape">☾</div><span className="star s1">✦</span><span className="star s2">·</span><span className="star s3">✧</span>
          <div className="now-playing"><button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause Moon Garden" : "Play Moon Garden"}>{playing ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor"/>}</button><div><small>TONIGHT&apos;S PICK</small><strong>Moon Garden</strong><span>Chapter 1 · The silver seed</span></div><div className={`wave ${playing ? "active" : ""}`}><i/><i/><i/><i/></div></div>
        </div>
      </section>

      <section id="stories" className="story-section">
        <div className="section-heading"><div><span className="eyebrow plain">Listen your way</span><h2>Find their next favourite</h2></div><button className="link-button">See all stories <ChevronRight size={18}/></button></div>
        <div className="filters" aria-label="Story filters"><button className="active">For you</button><button>Bedtime</button><button>Adventures</button><button>Learn & wonder</button><button>Music</button></div>
        <div className="story-grid">
          {stories.map((story, index) => <article className="story-card" key={story.title}>
            <div className={`cover ${story.tone}`}><span>{story.symbol}</span>{index > 1 && <div className="premium"><LockKeyhole size={13}/> PLUS</div>}<button className="card-play" aria-label={`Play ${story.title}`} onClick={() => setPlaying(true)}><Play size={18} fill="currentColor"/></button></div>
            <div className="card-meta"><div><h3>{story.title}</h3><p>{story.eyebrow}</p></div><button className={`heart ${liked.includes(story.title) ? "liked" : ""}`} onClick={() => toggleLike(story.title)} aria-label={`${liked.includes(story.title) ? "Remove" : "Add"} ${story.title} ${liked.includes(story.title) ? "from" : "to"} favourites`}><Heart size={19} fill={liked.includes(story.title) ? "currentColor" : "none"}/></button></div>
          </article>)}
        </div>
      </section>

      <section id="parents" className="parent-strip"><Headphones size={25}/><p><strong>Made for small ears. Designed for grown-up peace of mind.</strong><span>Age-aware discovery, calm design and no adverts.</span></p><a href="#membership">Why families choose us <ArrowRight size={17}/></a></section>

      {playing && <div className="mini-player" role="region" aria-label="Audio player"><div className="mini-cover">☾</div><div className="track"><strong>Moon Garden</strong><span>The silver seed</span></div><button onClick={() => setPlaying(false)} aria-label="Pause"><Pause size={20} fill="currentColor"/></button><div className="progress"><i/></div><span className="time">0:18 / 0:30</span></div>}
    </main>
  );
}

