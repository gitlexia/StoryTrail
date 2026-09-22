import type { Metadata } from "next";
import AuthForm from "./auth-form";
import styles from "./auth.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in | StoryTrail",
  description: "Sign in or create your StoryTrail family account.",
};

export default function AuthPage() {
  return (
    <main className={styles.page}>
      <section className={styles.introduction}>
        <Link className={styles.logo} href="/">
            StoryTrail
        </Link>

        <div>
          <p className={styles.eyebrow}>Stories made for listening</p>
          <h1>Big adventures begin with a little imagination.</h1>
          <p className={styles.description}>
            Discover thoughtful audio stories, build personalised libraries,
            and make listening part of your family&apos;s everyday routine.
          </p>
        </div>

        <p className={styles.footer}>Screen-light stories for curious minds.</p>
      </section>

      <section className={styles.formSection}>
        <AuthForm />
      </section>
    </main>
  );
}