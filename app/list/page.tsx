"use client";

import { AddListingForm } from "@/components/AddListingForm";
import { useToast } from "@/lib/useToast";
import { ShippingLocation } from "@/components/ProfileSettings";
import { createClient } from "@/lib/supabase/client";

export interface Listing {
  id: string;
  name: string;
  price: number;
  description: string;
  productType: string;
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
  const { toast } = useToast();
  const supabase = createClient();

  const submitListing = async (listing: Listing) => {
    async function uploadImage(file) {
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
    listing.images = await Promise.all(listing.images.map(uploadImage));
    try {
      const response = await fetch("/api/item-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit listing");
      }

      toast({
        title: "listing submitted successfully!",
        description: `${listing.length} listing(s) have been published to the marketplace.`,
      });
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 h-[93vh]">
      <main className="w-10/12 md:w-[80%] mx-auto md:px-4 py-12 relative">
        <div className="mb-8 flex flex-col md:flex-row  items-center md:gap-16">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2 font-extrabold">
              Create a Listing
            </h1>
            <p className="text-gray-600">
              Create your product listing before publishing them to the
              marketplace.
            </p>
          </div>
        </div>
        <AddListingForm onAddListing={submitListing} />
      </main>
    </div>
  );
};

export default CreateListings;
