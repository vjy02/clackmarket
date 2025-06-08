"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { useToast } from "@/lib/useToast";

export interface Listing {
  id: string;
  name: string;
  price: number;
  description: string;
  productType: string;
  brand: string;
  condition: string;
  images: string[];
  username: string;
  seller_id: string;
}

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("/api/item-update");
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      } else {
        toast({
          title: "Failed to fetch listings",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchListings();
  }, []);

  const deleteListing = async (id: string) => {
    const res = await fetch(`/api/item-update?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } else {
      toast({
        title: "Failed to delete listing",
        description: "Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[93vh] bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="w-[80%] mx-auto px-4 py-12 relative">
        <div className="mb-8 flex flex-col md:flex-row items-center md:gap-16">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2 font-extrabold">
              My Listings
            </h1>
            <p className="text-gray-600">
              Manage your product listings currently live on the marketplace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={deleteListing}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyListings;
