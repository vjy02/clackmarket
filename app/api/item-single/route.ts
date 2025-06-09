import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/item-single?id=123
export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const idParam = searchParams.get("id")

  const listingId = Number(idParam)
  if (isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 })
  }
    const formatData = {
        title: data.title,
        price: data.price,
        condition: data.condition,
        description: data.description,
        brand: data.brand,
        images: data.images,
        seller_username: data.seller_username,
        seller_uuid: data.seller_uuid,
        product_type: data.product_type,
        shipping_locations: data.shipping_locations,
        created_at: data.created_at,
    };

  return NextResponse.json(formatData)
}
