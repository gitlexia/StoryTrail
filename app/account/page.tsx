import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import styles from "./account.module.css";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const displayName =
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email?.split("@")[0] ??
    "Listener";

  const joinedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(user.created_at));

  return (
    <main className={styles.page}>
      <nav className={styles.navigation}>
        <Link className={styles.logo} href="/">
          StoryTrail
        </Link>

        <Link className={styles.homeLink} href="/">
          Back to stories
        </Link>
      </nav>

      <section className={styles.content}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Parent account</p>
          <h1>Welcome, {displayName}</h1>
          <p>
            Manage your family, listening library and membership from one
            place.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.profileCard}>
            <div className={styles.avatar} aria-hidden="true">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className={styles.label}>Signed in as</p>
              <h2>{displayName}</h2>
              <p>{user.email}</p>
            </div>
          </article>

          <article className={styles.detailCard}>
            <div>
              <p className={styles.label}>Membership</p>
              <p className={styles.value}>Free listener</p>
            </div>

            <div>
              <p className={styles.label}>Member since</p>
              <p className={styles.value}>{joinedDate}</p>
            </div>

            <div>
              <p className={styles.label}>Email status</p>
              <p className={styles.verified}>Verified</p>
            </div>
          </article>

          <article className={styles.placeholderCard}>
            <p className={styles.label}>Family profiles</p>
            <h2>Create your first listener profile</h2>
            <p>
              Profiles will keep favourites, recommendations and listening
              progress separate for each child.
            </p>
            <button type="button" disabled>
              Coming next
            </button>
          </article>
        </div>

        <form action={signOut}>
          <button className={styles.signOutButton} type="submit">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}