import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const listing = body.listing;

    // 🔍 Get seller's username using user UUID
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("uuid", user.id)
        .single();

    if (profileError || !profile?.username) {
        return NextResponse.json({ error: "Unable to fetch seller username" }, { status: 500 });
    }
    const insertData = {
        title: listing.name,
        price: listing.price,
        condition: listing.condition,
        description: listing.description,
        brand: listing.brand,
        images: listing.images,
        seller_username: profile.username,
        seller_uuid: user.id,
        product_type: listing.product_type,
        shipping_locations: profile.shipping_locations,
    };


    const { error } = await supabase.from("listings").insert(insertData);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Listings submitted successfully" });
}