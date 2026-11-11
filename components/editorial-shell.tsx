import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./editorial.module.css";

export default function EditorialShell({ children }: { children: ReactNode }) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/"><span aria-hidden="true">S</span> StoryTrail</Link>
        <nav aria-label="Main navigation">
          <Link href="/stories">Discover</Link>
          <Link href="/for-parents">For parents</Link>
          <Link href="/membership">Membership</Link>
        </nav>
      </header>
      {children}
      <footer className={styles.footer}>
        <Link href="/">StoryTrail</Link>
        <Link href="/about">About</Link>
        <Link href="/for-parents">For parents</Link>
        <Link href="/account">Account</Link>
      </footer>
    </main>
  );
}
