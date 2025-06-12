"use client"

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const LogoutButton = () => {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }

    // Delay slightly to ensure session is fully cleared
    setTimeout(() => {
      router.push("/");
    }, 100); // Optional slight delay for safety
  };

  return (
    <Button onClick={logout}   className="p-0 h-auto text-black bg-transparent shadow-none hover:bg-transparent"
 variant="ghost">      Sign Out
    </Button>
  );
};
