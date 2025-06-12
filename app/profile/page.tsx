"use client";

import { useEffect, useState } from "react";
import ProfileSettings from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        toast.error("Failed to load user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="pt-12 flex justify-center text-gray-600 min-h-screen">Loading user info...</div>;
  if (!sellerInfo) return <div className="p-6 min-h-screen">No user info found.</div>;

  const onSubmit = async (formData: typeof sellerInfo) => {
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
        toast.success("User updated successfully");
        router.push("/profile");
      } else {
        toast.error(json.error || "Failed to update user");
        console.error("Failed to update user:", json.error);
      }
    } catch (err) {
      toast.error("Error submitting form");
      console.error("Error submitting form:", err);
    }
  };
  return (
    <div className="flex flex-col px-6 py-12 h-full">
      <ProfileSettings initialSellerInfo={sellerInfo} onSubmit={onSubmit} />
    </div>
  );
}
