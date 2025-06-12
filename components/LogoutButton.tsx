'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button onClick={logout}>
      Sign Out
    </button>
  );
}
