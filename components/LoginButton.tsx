"use client";

import { useRouter } from "next/navigation";

export const LoginButton = () => {
        const router = useRouter();

  const handleLogin = async () => {
    router.push("/login");
  };
  return (
    <button onClick={handleLogin} className="hover:text-cyan-600">
      Sign In
    </button>
  );
};
