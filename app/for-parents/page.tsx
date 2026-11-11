import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialShell from "@/components/editorial-shell";
import { storyCover } from "@/lib/catalogue";
import styles from "../stories/discovery.module.css";

export const metadata: Metadata = { title: "For parents | StoryTrail", description: "What families can listen to, how profiles work, and what comes with StoryTrail Plus." };

export default function ParentsPage() {
  return <EditorialShell><div className={styles.wrap}>
    <section className={styles.hero}>
      <div>
        <p className={styles.kicker}>For parents &amp; carers</p>
        <h1>Small rituals.<br />Big imaginations.</h1>
        <p className={styles.lead}>Put on a story while breakfast is cooking, take one on the train, or make it part of winding down. Pick an age range, try a preview and see what your child wants to hear next.</p>
        <div className={styles.actions}><Link className={styles.button} href="/stories">Browse the library</Link><Link className={styles.secondary} href="/account">Manage family profiles</Link></div>
      </div>
      <div className={styles.art}><Image src={storyCover("cloudberry-woods")} fill alt="A small fox in a painted woodland" sizes="(max-width: 820px) 100vw, 45vw" /></div>
    </section>
    <section className={styles.panelGrid} aria-label="Getting started">
      <article className={styles.panel}><h2>Find the right mood</h2><p>Browse bedtime, adventure, music and learning stories. Each story lists a suggested age range and a short description, so you can pick something together.</p></article>
      <article className={styles.panel}><h2>Try before joining</h2><p>Listen to four previews straight away. Create a free account for the complete Moon Garden and The Tiny Orchestra stories.</p></article>
      <article className={styles.panel}><h2>Make room for each listener</h2><p>From your parent account, create listener profiles with a nickname, age band, avatar and interests. You can edit or remove profiles from the same page.</p></article>
    </section>
    <section className={styles.faq}>
      <h2>Good to know</h2>
      <details open><summary>What does Plus unlock?</summary><p>Plus gives the subscribing account access to all 15 full stories. See the <Link href="/membership">membership page</Link> for plan details.</p></details>
      <details><summary>How should I use the age ranges?</summary><p>They’re a starting point. Try a preview together and decide based on what your child enjoys and feels comfortable listening to.</p></details>
      <details><summary>Can we listen offline?</summary><p>StoryTrail currently streams recordings in your browser and requires an internet connection.</p></details>
      <details><summary>Do stories start on their own?</summary><p>Playback starts when you press play, and the player stays on the story you picked when it finishes.</p></details>
      <details><summary>How are the stories made?</summary><p>StoryTrail uses original short scripts, illustrated covers and a mix of recorded and synthetic narration.</p></details>
    </section>
  </div></EditorialShell>;
}
