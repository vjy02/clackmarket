import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Get user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    email,
    phone,
    shippingLocations,
    paymentMethods,
    discord,
    username,
    reddit,
  } = body;

  // 🔍 Check for duplicate username (excluding current user)
  const { data: existingUsers, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .neq("uuid", user.id) // Make sure we don’t block updating own username
    .maybeSingle();

  if (checkError && checkError.code !== "PGRST116") {
    return NextResponse.json({ error: "Error checking username" }, { status: 500 });
  }

  if (existingUsers) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase.from("users").upsert(
    {
      uuid: user.id,
      email,
      phone,
      shipping_locations: shippingLocations,
      payment_methods: paymentMethods,
      discord,
      username,
      reddit,
    },
    { onConflict: "uuid" } // Make sure this column is UNIQUE
  )

  if (error) {
    if (
      error.message?.includes("duplicate key value") &&
      error.message?.includes("user_username_key")
    ) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }


  return NextResponse.json({ success: true, data });
}