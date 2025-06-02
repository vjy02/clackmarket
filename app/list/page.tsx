"use client";

import { useState } from "react";
import { AddListingCard } from "@/components/AddListingCard";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/useToast";

export interface Listing {
  id: string;
  name: string;
  price: number;
  description: string;
  productType: string;
  brand: string;
  condition: string;
  images: File[];
}

export interface SellerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethods: string[];
  discord: string;
}

const CreateListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    paymentMethods: ["PayPal", "Bank Transfer"],
  });
  const { toast } = useToast();

  const addListing = (listing: Omit<Listing, "id">) => {
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
    };
    setListings((prev) => [...prev, newListing]);
  };

  const updateListing = (id: string, updatedListing: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, ...updatedListing } : listing
      )
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  const submitAllListings = () => {
    if (listings.length === 0) {
      toast({
        title: "No listings to submit",
        description: "Please create at least one listing before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the listings to your backend
    console.log("Submitting listings:", listings);
    console.log("Seller info:", sellerInfo);

    toast({
      title: "Listings submitted successfully!",
      description: `${listings.length} listing(s) have been published to the marketplace.`,
    });

    // Clear listings after successful submission
    setListings([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-12 relative">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Listings
          </h1>
          <p className="text-gray-600">
            Create and manage your product listings before publishing them to
            the marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Listings Grid */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AddListingCard onAddListing={addListing} />
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onUpdate={updateListing}
                  onDelete={deleteListing}
                />
              ))}
            </div>
          </div>

          {/* Seller Profile Sidebar */}
          <div className="absolute right-0">
            {listings.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button onClick={submitAllListings} size="lg" className="px-8">
                  Publish All Listings ({listings.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateListings;
