"use client";

import { useState } from "react";
import { AddListingForm } from "@/components/AddListingForm";
import { toast } from "sonner";
import { ShippingLocation } from "@/components/ProfileSettings";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import keycapImage from "@/public/box.png"
import { PlusCircle } from "lucide-react";

export interface Listing {
  id: string;
  name: string;
  price: number;
  description: string;
  product_type: string;
  brand: string;
  condition: string;
  images: File[] | string[];
}

export interface SellerInfo {
  email: string;
  phone: string;
  reddit: string;
  shippingLocations: ShippingLocation[];
  paymentMethods: string[];
  discord: string;
  username: string;
}

const CreateListings = () => {
  const supabase = createClient();

  // Track submission state: "form" | "loading" | "done"
  const [state, setState] = useState<"form" | "loading" | "done">("form");

  const submitListing = async (listing: Listing) => {
    async function uploadImage(file: File) {
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage
        .from("listings")
        .upload(filePath, file);
      if (error) {
        throw error;
      }
      const { data } = supabase.storage.from("listings").getPublicUrl(filePath);
      return data.publicUrl;
    }

    setState("loading");

    try {
      listing.images = await Promise.all(listing.images.map(uploadImage));

      const response = await fetch("/api/item-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit listing");
      }

      toast.success(`Listing submitted successfully!`);

      setState("done");
    } catch (err: any) {
      toast.error(`Submission failed: ${err.message}`);
      setState("form");
    }
  };

  const resetForm = () => {
    setState("form");
  };

  return (
    <div className="h-full flex items-center justify-center pb-16">

        {state === "form" &&              <main className="w-10/12 md:w-[80%] mx-auto md:px-4 pt-9 relative"><div className="mb-8 flex flex-col md:flex-row items-center md:gap-16">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2 font-extrabold">
              Create a Listing
            </h1>
            <p className="text-gray-600">
              Create your product listing before publishing them to the
              marketplace.
            </p>
          </div>
        </div><AddListingForm onAddListing={submitListing} /></main>}

{state === "loading" && (
  <div className="flex flex-col justify-center items-center py-20 gap-4 h-[50vh]">
    <svg
      className="animate-spin h-12 w-12 text-purple-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
    <p className="text-lg">
      Uploading your images and sending over listing...
    </p>
  </div>
)}

        {state === "done" && (
          <div className="text-center py-20 flex flex-col justify-center items-center">
            <Image 
            src={keycapImage}
            height={100}
            width={200}
            alt="keycap image"
            />
            <p className="text-xl font-semibold text-gray-700 mb-12">
              Your listing will be approved by admins within the next 24 hours!
            </p>
            <button
              onClick={resetForm}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md"
            >
              Add another listing
            </button>
          </div>
        )}
    </div>
  );
};

export default CreateListings;
