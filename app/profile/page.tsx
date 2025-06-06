"use client";

import { useEffect, useState } from "react";
import ProfileSettings from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [sellerInfo, setSellerInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user-fetch");
        if (!res.ok) throw new Error("Failed to fetch user data");
        const { user } = await res.json();
        setSellerInfo(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="p-6">Loading user info...</div>;
  if (!sellerInfo) return <div className="p-6">No user info found.</div>;

  const onSubmit = async (formData: typeof initSeller) => {
    console.log("PATCH")
    try {
      const response = await fetch("/api/user-fetch", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (response.ok) {
        console.log("User updated successfully");
        router.push("/profile");
      } else {
        console.error("Failed to update user:", json.error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col px-6 py-12">
      <ProfileSettings initialSellerInfo={sellerInfo} onSubmit={onSubmit} />
    </div>
  );
}
