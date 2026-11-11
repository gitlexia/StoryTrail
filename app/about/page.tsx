import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EditorialShell from "@/components/editorial-shell";
import { storyCover } from "@/lib/catalogue";
import styles from "../stories/discovery.module.css";

export const metadata: Metadata = { title: "Why families choose StoryTrail", description: "A little about StoryTrail and the everyday moments it was made for." };

export default function AboutPage() {
  return <EditorialShell><section className={`${styles.wrap} ${styles.hero}`}>
    <div>
      <p className={styles.kicker}>Why families choose StoryTrail</p>
      <h1>A little more story in the day.</h1>
      <p className={styles.lead}>StoryTrail is an audio story library for curious kids and the people who listen with them. Find a tiny orchestra, a garden that wakes by moonlight, or a mystery that’s just right for the school run.</p>
      <p className={styles.lead}>Each story pairs an illustrated cover with a short description and suggested age range, so families can find something they want to hear and put the screen down once it starts.</p>
      <div className={styles.actions}><Link className={styles.button} href="/stories">Find a story</Link><Link className={styles.secondary} href="/for-parents">More for parents</Link></div>
    </div>
    <div className={styles.art}><Image src={storyCover("the-tiny-orchestra")} fill alt="A painted miniature orchestra" sizes="(max-width: 820px) 100vw, 45vw" /></div>
  </section></EditorialShell>;
}
