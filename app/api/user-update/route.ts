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
  const { email, phone, shippingLocations, paymentMethods, discord, username } = body;

  // Update the users table with form data and user.id (uuid from OAuth)
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        uuid: user.id, // UUID from OAuth user
        email,
        phone,
        shipping_locations: shippingLocations,
        payment_methods: paymentMethods, // Adjust field name if needed
        discord,
        username,
      },
      { onConflict: "id" }
    );

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
