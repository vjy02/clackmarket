import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const region = searchParams.get("region")
  const searchTerm = searchParams.get("search")
  const productType = searchParams.get("productType")
  const sortBy = searchParams.get("sortBy")
  const isGlobal = searchParams.get("isGlobal") === "true"

  const page = Number(searchParams.get("page") ?? 0)
  const limit = Number(searchParams.get("limit") ?? 15)

  // Query listings directly
  let listingsQuery = supabase
    .from("listings")
    .select("*")
    .range(page * limit, page * limit + limit - 1)

  // Apply filters
  if (productType) {
    listingsQuery = listingsQuery.eq("product_type", productType)
  }

  if (searchTerm) {
    listingsQuery = listingsQuery.or(
      `title.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,product_type.ilike.%${searchTerm}%`
    )
  }

  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case "price-low-high":
        listingsQuery = listingsQuery.order("price", { ascending: true })
        break
      case "price-high-low":
        listingsQuery = listingsQuery.order("price", { ascending: false })
        break
      case "newest-first":
        listingsQuery = listingsQuery.order("created_at", { ascending: false })
        break
      case "oldest-first":
        listingsQuery = listingsQuery.order("created_at", { ascending: true })
        break
      default:
        listingsQuery = listingsQuery.order("created_at", { ascending: false })
    }
  } else {
    listingsQuery = listingsQuery.order("created_at", { ascending: false })
  }

  const { data: listings, error: listingsError } = await listingsQuery

  if (listingsError) {
    console.error("Listings query error:", listingsError)
    return NextResponse.json({ error: listingsError.message }, { status: 500 })
  }

  // Filter based on shipping criteria
  const filteredListings = listings.filter((listing) => {
    let locations

    try {
      locations =
        typeof listing.shipping_locations === "string"
          ? JSON.parse(listing.shipping_locations)
          : listing.shipping_locations
    } catch (e) {
      console.error("Failed to parse shipping_locations:", e)
      return false
    }

    if (!Array.isArray(locations)) return false

    // Check if meets global filter
    if (isGlobal && !locations.some((loc) => loc.isGlobal)) {
      return false
    }

    // Check if meets region filter
    if (region) {
      const shipsToRegion = locations.some(
        (loc) =>
          loc.isGlobal === true || (loc.countryId && loc.countryId.toString() === region)
      )
      if (!shipsToRegion) return false
    }

    return true
  })

  // Format and return listings
  const formatted = filteredListings.map((listing) => {
    let parsedShipping = []

    try {
      const locs =
        typeof listing.shipping_locations === "string"
          ? JSON.parse(listing.shipping_locations)
          : listing.shipping_locations

      parsedShipping = Array.isArray(locs)
        ? locs.map((loc) => ({
            cost: loc.cost,
            isGlobal: loc.isGlobal,
            countryId: loc.countryId,
            stateId: loc.stateId,
          }))
        : []
    } catch (e) {
      console.error("Shipping parse error for listing:", listing.id, e)
    }

    return {
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
      created_at: listing.created_at,
      isGlobalShipping: parsedShipping.some((s) => s.isGlobal),
      shippingOptions: parsedShipping,
    }
  })

  return NextResponse.json(formatted)
}
