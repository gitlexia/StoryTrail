import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = request.nextUrl.clone();
      destination.pathname = "/";
      destination.search = "";

      return NextResponse.redirect(destination);
    }
  }

  const errorDestination = request.nextUrl.clone();
  errorDestination.pathname = "/auth";
  errorDestination.search = "?error=authentication_failed";

  return NextResponse.redirect(errorDestination);
}