'use client'

import ProfileSettings from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";

export const Onboarding = () => {
  const router = useRouter();

  const initSeller = {
    email: "",
    phone: "",
    shippingLocations: [],
    paymentMethods: [],
    discord: "",
    username: "",
    reddit: "",
  };

  const onSubmit = async (formData: typeof initSeller) => {
    try {
      const response = await fetch("/api/user-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();
      if (response.ok && json.success) {
        router.push("/");
      } else {
        console.error("Failed to update user:", json.error);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to ClackMarket</h1>
        <h3 className="text-lg mb-6">Fill in the form to get started.</h3>
        <ProfileSettings initialSellerInfo={initSeller} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default Onboarding;
