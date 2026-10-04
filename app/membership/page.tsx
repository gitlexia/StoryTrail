import Link from "next/link";
import styles from "./membership.module.css";
import { createCheckoutSession } from "./actions";

export default function MembershipPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.navigation}>
        <Link className={styles.logo} href="/">
          StoryTrail
        </Link>

        <Link href="/#stories">Back to stories</Link>
      </nav>

      <section className={styles.introduction}>
        <p className={styles.eyebrow}>StoryTrail Plus</p>
        <h1>Every story. Every adventure.</h1>
        <p>
          Unlock the complete StoryTrail library for calm, screen-free
          listening whenever your family needs it.
        </p>
      </section>

      <section className={styles.plans}>
        <article className={styles.freePlan}>
          <p className={styles.planName}>Free</p>
          <h2>£0</h2>
          <ul>
            <li>All story previews</li>
            <li>Selected full stories</li>
            <li>Family listener profiles</li>
          </ul>

          <Link className={styles.secondaryButton} href="/auth">
            Create free account
          </Link>
        </article>

        <article className={styles.plusPlan}>
          <p className={styles.planName}>StoryTrail Plus</p>
          <h2>
            £4.99 <span>/ month</span>
          </h2>
          <ul>
            <li>Every complete story</li>
            <li>New stories added regularly</li>
            <li>Personalised family libraries</li>
          </ul>

          <form action={createCheckoutSession}>
            <button type="submit">
                Subscribe with Stripe
            </button>
            </form>
        </article>
      </section>
    </main>
  );
}