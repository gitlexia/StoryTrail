import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  const { slug } = await context.params;
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must sign in to listen to full stories." },
      { status: 401 },
    );
  }

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("full_audio_path, access_level")
    .eq("slug", slug)
    .single();

  if (storyError || !story) {
    return NextResponse.json(
      { error: "Story not found." },
      { status: 404 },
    );
  }

  if (!story.full_audio_path) {
    return NextResponse.json(
      { error: "The full story is not available yet." },
      { status: 404 },
    );
  }

  if (story.access_level === "premium") {
    return NextResponse.json(
      { error: "A StoryTrail Plus membership is required." },
      { status: 403 },
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    console.error("Missing Supabase server environment variables.");

    return NextResponse.json(
      { error: "Audio service is not configured." },
      { status: 500 },
    );
  }

  const supabaseAdmin = createAdminClient(
    supabaseUrl,
    secretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const { data, error } = await supabaseAdmin.storage
    .from("story-audio")
    .createSignedUrl(story.full_audio_path, 3600);

  if (error || !data) {
    console.error("Signed URL error:", error);

    return NextResponse.json(
      { error: "Unable to prepare the full story." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
  });
}