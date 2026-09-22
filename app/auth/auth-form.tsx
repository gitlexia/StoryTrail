"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

type Mode = "login" | "signup";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage("");
    setIsError(false);
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
      } else {
        setMessage("Check your email to confirm your StoryTrail account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setIsError(true);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setIsLoading(false);
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeading}>
        <p className={styles.eyebrow}>
          {mode === "login" ? "Welcome back" : "Join StoryTrail"}
        </p>
        <h2>{mode === "login" ? "Sign in to listen" : "Create your account"}</h2>
        <p>
          {mode === "login"
            ? "Return to your saved stories and listening progress."
            : "Start building a library your family will love."}
        </p>
      </div>

      <div className={styles.tabs} aria-label="Authentication options">
        <button
          type="button"
          className={mode === "login" ? styles.activeTab : ""}
          onClick={() => changeMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={mode === "signup" ? styles.activeTab : ""}
          onClick={() => changeMode("signup")}
        >
          Create account
        </button>
      </div>

      <button
        type="button"
        className={styles.googleButton}
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <span className={styles.googleMark} aria-hidden="true">
          G
        </span>
        Continue with Google
      </button>

      <div className={styles.divider}>
        <span>or continue with email</span>
      </div>

      <form onSubmit={handleEmailAuth} className={styles.form}>
        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </label>

        {message && (
          <p
            className={isError ? styles.errorMessage : styles.successMessage}
            role={isError ? "alert" : "status"}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className={styles.terms}>
        By continuing, you agree to StoryTrail&apos;s Terms and Privacy Policy.
      </p>
    </div>
  );
}