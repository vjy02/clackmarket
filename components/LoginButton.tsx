"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const LoginButton = () => {
        const router = useRouter();

  const handleLogin = async () => {
    router.push("/login");
  };
  return (
    <Button onClick={handleLogin}   className="p-0 h-auto text-black hover:text-cyan-600 bg-transparent shadow-none hover:bg-transparent"
 variant="ghost">
      Sign In
    </Button>
  );
};
