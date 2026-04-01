import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const {userId} = await params;

    // Verify user session/token first (middleware/auth check)
    // Then fetch from profiles table
    const profile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId);

    if (!profile.data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
