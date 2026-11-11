"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { catalogue, storyCover } from "@/lib/catalogue";
import styles from "./discovery.module.css";

export default function CatalogueGrid() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const matches = catalogue.filter(story =>
    (!category || story.category === category) &&
    `${story.title} ${story.description}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  return <>
    <div className={styles.filters}>
      <label>Search stories<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Try whale or music" /></label>
      <label>Category<select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">All categories</option>
        {[...new Set(catalogue.map(story => story.category))].map(name => <option key={name}>{name}</option>)}
      </select></label>
    </div>
    <p role="status">{matches.length} {matches.length === 1 ? "story" : "stories"}</p>
    {!matches.length && <p>No stories match. Try another search or category.</p>}
    <div className={styles.grid}>
      {matches.map(story => <article className={styles.card} key={story.slug}>
        <Link className={styles.cover} href={`/stories/${story.slug}`} aria-label={story.title}>
          <Image src={storyCover(story.slug)} alt="" fill sizes="(max-width: 480px) 100vw, (max-width: 820px) 50vw, 33vw" />
          <span className={styles.badge}>{story.premium && <LockKeyhole size={13} aria-hidden="true" />}{story.premium ? "Plus" : "Free"}</span>
        </Link>
        <div className={styles.cardText}>
          <h2><Link href={`/stories/${story.slug}`}>{story.title}</Link></h2>
          <p>{story.description}</p>
          <small>{story.category} · Ages {story.ages} · {story.previewPath ? "Preview available" : "Plus only"}</small>
        </div>
      </article>)}
    </div>
  </>;
}
