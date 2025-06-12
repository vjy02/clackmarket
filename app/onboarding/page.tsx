'use client'

import ProfileSettings from "@/components/ProfileSettings";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

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
    } else if (response.status === 409) {
      toast.error("Username is already taken. Please choose another.");
    } else {
      toast.error(json.error || "Something went wrong. Please try again.");
    }
  } catch (err) {
    toast.error("Unexpected error. Please try again.");
    console.error(err);
  }
};

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto px-6 py-8">
      <div className="mx-auto w-10/12 mb-16">
        <h1 className="text-3xl font-bold mb-4">Welcome to ClackMarket</h1>
        <h3 className="text-lg mb-6">Fill in the form to get started.</h3>
      </div>
              <ProfileSettings initialSellerInfo={initSeller} onSubmit={onSubmit} />

    </div>
  );
};

export default Onboarding;
