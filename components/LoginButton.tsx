"use client"

import { createClient } from "@/lib/supabase/client";

export const LoginButton = () => {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };
  return <button onClick={handleLogin}  className="hover:text-cyan-600">Sign In</button>;
};
