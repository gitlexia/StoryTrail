import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { catalogue } from "@/lib/catalogue";
import { adminClient, hasPlus } from "@/lib/plus";

function reply(body: { error: string } | { signedUrl: string }, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return reply({ error: "Sign in to listen to the full story." }, 401);
    const entry = catalogue.find(story => story.slug === slug);
    if (!entry) return reply({ error: "Story not found." }, 404);
    const { data: story, error } = await supabase.from("stories")
      .select("access_level, full_audio_path").eq("slug", slug).eq("is_published", true).maybeSingle();
    if (error) throw error;
    if (!story) return reply({ error: "Story not found." }, 404);
    if ((entry.premium || story.access_level !== "free") && !await hasPlus(user.id)) {
      return reply({ error: "A StoryTrail Plus membership is required." }, 403);
    }
    if (!story.full_audio_path) return reply({ error: "The full recording is not available yet." }, 404);
    const { data, error: signingError } = await adminClient().storage
      .from("story-audio").createSignedUrl(story.full_audio_path, 900);
    if (signingError) throw signingError;
    return reply({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error("Full audio request failed", error instanceof Error ? error.name : "storage or database error");
    return reply({ error: "Unable to prepare the full story. Please try again." }, 503);
  }
}
