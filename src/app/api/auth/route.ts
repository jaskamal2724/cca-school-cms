import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const params = await req.json();

  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: params.email,
        password: params.password,
      },
    );

    if (signInError) {
      return NextResponse.json({ error: signInError.message, message:"Sign In Error" }, { status: 400});
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user?.id);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message , message:"Fetching Profile Error" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        userId: data.user?.id,
        fullName: profile?.[0].full_name,
        email: profile?.[0].email,
        role: profile?.[0].role,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
