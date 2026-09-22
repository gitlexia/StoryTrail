"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createListenerProfile,
  type ProfileActionState,
} from "./actions";
import styles from "./account.module.css";

const initialState: ProfileActionState = {
  success: false,
  error: null,
};

const avatars = [
  { value: "moon", symbol: "☾", label: "Moon" },
  { value: "star", symbol: "✦", label: "Star" },
  { value: "rocket", symbol: "🚀", label: "Rocket" },
  { value: "forest", symbol: "♧", label: "Forest" },
];

const interests = [
  "Adventures",
  "Animals",
  "Bedtime",
  "Learning",
  "Music",
  "Space",
];

export default function ProfileForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createListenerProfile,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className={styles.profileForm}>
      <div className={styles.formField}>
        <label htmlFor="profile-name">Listener name</label>
        <input
          id="profile-name"
          name="name"
          type="text"
          minLength={1}
          maxLength={40}
          placeholder="For example, Emma"
          required
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="age-band">Age range</label>
        <select id="age-band" name="ageBand" defaultValue="" required>
          <option value="" disabled>
            Choose an age range
          </option>
          <option value="3-5">Ages 3–5</option>
          <option value="6-8">Ages 6–8</option>
          <option value="9-12">Ages 9–12</option>
        </select>
      </div>

      <fieldset className={styles.choiceGroup}>
        <legend>Choose an avatar</legend>

        <div className={styles.avatarChoices}>
          {avatars.map((avatar, index) => (
            <label key={avatar.value} className={styles.avatarChoice}>
              <input
                type="radio"
                name="avatar"
                value={avatar.value}
                defaultChecked={index === 0}
              />
              <span aria-hidden="true">{avatar.symbol}</span>
              <small>{avatar.label}</small>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.choiceGroup}>
        <legend>What do they enjoy?</legend>

        <div className={styles.interestChoices}>
          {interests.map((interest) => (
            <label key={interest}>
              <input
                type="checkbox"
                name="interests"
                value={interest.toLowerCase()}
              />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.error && (
        <p className={styles.formError} role="alert">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className={styles.formSuccess} role="status">
          Listener profile created.
        </p>
      )}

      <button
        type="submit"
        className={styles.createProfileButton}
        disabled={isPending}
      >
        {isPending ? "Creating profile…" : "Create listener profile"}
      </button>
    </form>
  );
}