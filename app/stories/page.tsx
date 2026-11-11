import type { Metadata } from "next";
import EditorialShell from "@/components/editorial-shell";
import CatalogueGrid from "./catalogue-grid";
import styles from "./discovery.module.css";

export const metadata: Metadata = { title: "All stories | StoryTrail", description: "Explore StoryTrail’s illustrated library of audio stories for kids." };

export default function StoriesPage() {
  return <EditorialShell><section className={styles.wrap}>
    <p className={styles.kicker}>The listening library</p>
    <h1>Find their next adventure.</h1>
    <p className={styles.lead}>Try four previews without signing in. A free account includes two full stories; StoryTrail Plus opens the entire collection.</p>
    <CatalogueGrid />
  </section></EditorialShell>;
}
