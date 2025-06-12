import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const seller_uuid = searchParams.get("seller_uuid");

  if (!seller_uuid) {
    return NextResponse.json({ error: "Missing seller_uuid" }, { status: 400 });
  }

  // Optional: Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(seller_uuid)) {
    return NextResponse.json({ error: "Invalid UUID format" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users") // replace with your actual users table name
    .select("*")
    .eq("uuid", seller_uuid)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
