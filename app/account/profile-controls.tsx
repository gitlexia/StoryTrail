"use client";

import { useActionState, useEffect, useState } from "react";
import {
  updateListenerProfile,
  type ProfileActionState,
} from "./actions";
import DeleteProfileButton from "./delete-profile-button";
import styles from "./account.module.css";

type ListenerProfile = {
  id: string;
  name: string;
  age_band: string;
  avatar: string;
  interests: string[];
};

type ProfileControlsProps = {
  profile: ListenerProfile;
};

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

export default function ProfileControls({
  profile,
}: ProfileControlsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateListenerProfile,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
    }
  }, [state.success]);

  return (
    <>
      <div className={styles.profileActions}>
        <button
          type="button"
          className={styles.editProfileButton}
          onClick={() => setIsEditing((current) => !current)}
          aria-expanded={isEditing}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>

        <DeleteProfileButton
          profileId={profile.id}
          profileName={profile.name}
        />
      </div>

      {isEditing && (
        <form action={formAction} className={styles.editProfileForm}>
          <input type="hidden" name="profileId" value={profile.id} />

          <div className={styles.formField}>
            <label>
              Listener name
              <input
                name="name"
                type="text"
                defaultValue={profile.name}
                minLength={1}
                maxLength={40}
                required
              />
            </label>
          </div>

          <div className={styles.formField}>
            <label>
              Age range
              <select
                name="ageBand"
                defaultValue={profile.age_band}
                required
              >
                <option value="3-5">Ages 3–5</option>
                <option value="6-8">Ages 6–8</option>
                <option value="9-12">Ages 9–12</option>
              </select>
            </label>
          </div>

          <fieldset className={styles.choiceGroup}>
            <legend>Avatar</legend>

            <div className={styles.avatarChoices}>
              {avatars.map((avatar) => (
                <label key={avatar.value} className={styles.avatarChoice}>
                  <input
                    type="radio"
                    name="avatar"
                    value={avatar.value}
                    defaultChecked={profile.avatar === avatar.value}
                  />
                  <span aria-hidden="true">{avatar.symbol}</span>
                  <small>{avatar.label}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.choiceGroup}>
            <legend>Interests</legend>

            <div className={styles.interestChoices}>
              {interests.map((interest) => {
                const value = interest.toLowerCase();

                return (
                  <label key={interest}>
                    <input
                      type="checkbox"
                      name="interests"
                      value={value}
                      defaultChecked={profile.interests.includes(value)}
                    />
                    <span>{interest}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {state.error && (
            <p className={styles.formError} role="alert">
              {state.error}
            </p>
          )}

          <div className={styles.editFormActions}>
            <button
              type="button"
              className={styles.cancelEditButton}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveProfileButton}
              disabled={isPending}
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}