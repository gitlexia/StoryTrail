"use client";

import { useFormStatus } from "react-dom";
import { deleteListenerProfile } from "./actions";
import styles from "./account.module.css";

type DeleteProfileButtonProps = {
  profileId: string;
  profileName: string;
};

function DeleteButton({ profileName }: { profileName: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={styles.deleteProfileButton}
      disabled={pending}
      aria-label={`Delete ${profileName}'s profile`}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export default function DeleteProfileButton({
  profileId,
  profileName,
}: DeleteProfileButtonProps) {
  return (
    <form
      action={deleteListenerProfile}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete ${profileName}'s listener profile? This cannot be undone.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="profileId" value={profileId} />
      <DeleteButton profileName={profileName} />
    </form>
  );
}