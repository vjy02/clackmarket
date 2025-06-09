// app/api/my-listings/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_uuid", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = data.map((listing) => ({
    id: listing.id,
    name: listing.title,
    price: listing.price,
    description: listing.description,
    product_type: listing.product_type,
    brand: listing.brand,
    condition: listing.condition,
    images: listing.images,
    username: listing.seller_username,
    seller_id: listing.seller_uuid,
    shipping_locations: listing.shipping_locations,
    created_at: listing.created_at,
  }));

  return NextResponse.json(formatted);
}

export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing listing ID" }, { status: 400 });
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("seller_uuid", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Listing deleted" });
}
