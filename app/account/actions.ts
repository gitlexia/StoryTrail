"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedAgeBands = ["3-5", "6-8", "9-12"];
const allowedAvatars = ["moon", "star", "rocket", "forest"];
const allowedInterests = [
  "adventures",
  "animals",
  "bedtime",
  "learning",
  "music",
  "space",
];

export type ProfileActionState = {
  success: boolean;
  error: string | null;
};

export async function createListenerProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to create a listener profile.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const ageBand = String(formData.get("ageBand") ?? "");
  const avatar = String(formData.get("avatar") ?? "");
  const interests = formData
    .getAll("interests")
    .map(String)
    .filter((interest) => allowedInterests.includes(interest));

  if (name.length < 1 || name.length > 40) {
    return {
      success: false,
      error: "Enter a profile name between 1 and 40 characters.",
    };
  }

  if (!allowedAgeBands.includes(ageBand)) {
    return {
      success: false,
      error: "Choose a valid age range.",
    };
  }

  if (!allowedAvatars.includes(avatar)) {
    return {
      success: false,
      error: "Choose a valid avatar.",
    };
  }

  const { error } = await supabase.from("listener_profiles").insert({
    user_id: user.id,
    name,
    age_band: ageBand,
    avatar,
    interests,
  });

  if (error) {
    console.error("Unable to create listener profile:", error);

    return {
      success: false,
      error: "We couldn't create the profile. Please try again.",
    };
  }

  revalidatePath("/account");

  return {
    success: true,
    error: null,
  };
}

export async function updateListenerProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to update a listener profile.",
    };
  }

  const profileId = String(formData.get("profileId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const ageBand = String(formData.get("ageBand") ?? "");
  const avatar = String(formData.get("avatar") ?? "");
  const interests = formData
    .getAll("interests")
    .map(String)
    .filter((interest) => allowedInterests.includes(interest));

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(profileId)) {
    return {
      success: false,
      error: "This listener profile is invalid.",
    };
  }

  if (name.length < 1 || name.length > 40) {
    return {
      success: false,
      error: "Enter a profile name between 1 and 40 characters.",
    };
  }

  if (!allowedAgeBands.includes(ageBand)) {
    return {
      success: false,
      error: "Choose a valid age range.",
    };
  }

  if (!allowedAvatars.includes(avatar)) {
    return {
      success: false,
      error: "Choose a valid avatar.",
    };
  }

  const { data, error } = await supabase
    .from("listener_profiles")
    .update({
      name,
      age_band: ageBand,
      avatar,
      interests,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Unable to update listener profile:", error);

    return {
      success: false,
      error: "We couldn't update the profile. Please try again.",
    };
  }

  revalidatePath("/account");

  return {
    success: true,
    error: null,
  };
}

export async function deleteListenerProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const profileId = String(formData.get("profileId") ?? "");

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(profileId)) {
    console.error("Invalid listener profile ID.");
    return;
  }

  const { error } = await supabase
    .from("listener_profiles")
    .delete()
    .eq("id", profileId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Unable to delete listener profile:", error);
    return;
  }

  revalidatePath("/account");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth");
}