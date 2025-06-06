import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Convert snake_case to camelCase (1 level deep)
function toCamelCase(obj: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

// Convert camelCase to snake_case (1 level deep)
function toSnakeCase(obj: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
}

// GET - Fetch user data
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const camelCasedUser = toCamelCase(data);
  return NextResponse.json({ user: camelCasedUser });
}

// PATCH - Update user data
export async function PATCH(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const updateData = toSnakeCase(body); // Convert camelCase to snake_case

const { error, count } = await supabase
  .from("users")
  .update(updateData)
  .eq("uuid", user.id)
  .select("id");

if (error) {
  console.error("Supabase update error:", error.message);
  return NextResponse.json({ error: error.message }, { status: 500 });
}

if (count === 0) {
  console.warn("Update matched 0 rows — check your UUID match and RLS.");
  return NextResponse.json({ warning: "Update matched no rows." }, { status: 200 });
}

  return NextResponse.json({ message: "User updated successfully" });
}
