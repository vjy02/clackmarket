"use client";

import { useEffect, useState } from "react";
import redditIcon from "@/public/reddit.svg";
import discordIcon from "@/public/discord.svg";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Package,
  User,
  Mail,
  Phone,
  MessageCircle,
  Globe,
  Truck,
  AlertCircle,
  Share,
  Flag,
  CircleCheck,
} from "lucide-react";
import { toast } from "sonner";

import type { Listing } from "@/types";

export default function ItemPage() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerInfo, setSellerInfo] = useState(null);
  const params = useParams();
  const listingId = params.id as string;

  const handleReport = async () => {
    try {
      const url = window.location.href;
      const res = await fetch("/api/report", {
        method: "POST",
        body: JSON.stringify({ listing_id: listingId, url }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Report failed");

      toast.success("Listing reported.");
    } catch {
      toast.error("Could not report listing.");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Failed to copy.");
    }
  };
  useEffect(() => {
    const fetchListingAndSeller = async () => {
      try {
        setLoading(true);

        // Fetch the listing
        const res = await fetch(`/api/item-single?id=${listingId}`);
        if (!res.ok) throw new Error("Failed to fetch listing.");
        const listingData = await res.json();
        setListing(listingData);

        // Fetch the seller using seller_uuid from listing
        if (listingData?.seller_uuid) {
          const userRes = await fetch(
            `/api/seller-fetch?seller_uuid=${listingData.seller_uuid}`
          );
          if (!userRes.ok) throw new Error("Failed to fetch user data");
          const userData = await userRes.json();
          setSellerInfo(userData);
        }
      } catch (err) {
        setError(
          "Failed to load listing or seller info. Please try again later."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListingAndSeller();
    }
  }, [listingId]);

  const formatPrice = (priceInCents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceInCents);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="aspect-square rounded-md" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-1/3" />
              </div>
              <Skeleton className="h-32" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm border">
              <Image
                src={
                  listing.images[selectedImageIndex] ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={listing.title}
                width={600}
                height={600}
                className="w-full h-full object-contain"
              />
            </div>
            {listing.images.length > 1 && (
              <div
                className={`grid gap-2 ${
                  listing.images.length === 2 ? "grid-cols-2" : "grid-cols-3"
                }`}
              >
                {listing.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=150&width=150"}
                      alt={`${listing.title} - Image ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs font-medium">
                  {listing.product_type}
                </Badge>
                <div className="flex justify-end gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-sm"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleReport}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
                {listing.live && (
                  <Badge className="bg-green-100 text-green-800 text-xs font-medium border border-green-200">
                    Live
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {listing.title}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                Listed on {formatDate(listing.created_at)}
              </p>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {formatPrice(listing.price)}
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  Brand: {listing.brand}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  Condition: {listing.condition}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            <Separator />

            {/* Seller Information */}
            <Card className="border-gray-200">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {sellerInfo?.email && (
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-12"
                      onClick={() => {
                        navigator.clipboard.writeText(sellerInfo.email);
                        toast.success("Email copied to clipboard");
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{sellerInfo.email}</span>
                    </Button>
                  )}
                  {sellerInfo?.phone && (
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-12"
                      onClick={() => {
                        navigator.clipboard.writeText(sellerInfo.phone);
                        toast.success("Phone number copied to clipboard");
                      }}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="truncate">{sellerInfo.phone}</span>
                    </Button>
                  )}
                  {sellerInfo?.reddit && (
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-12"
                      onClick={() => {
                        window.open(
                          `https://reddit.com/message/compose/?to=${sellerInfo.reddit}`,
                          "_blank"
                        );
                      }}
                    >
                      <Image
                        src={redditIcon}
                        height={25}
                        width={25}
                        alt="reddit icon"
                      />
                      <span className="truncate">u/{sellerInfo.reddit}</span>
                    </Button>
                  )}
                  {sellerInfo?.discord && (
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-12"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://discord.com/users/${sellerInfo.discord}`
                        );
                        toast.success("Discord username copied to clipboard");
                      }}
                    >
                      <Image
                        src={discordIcon}
                        height={25}
                        width={25}
                        alt="discord icon"
                      />                      <span className="truncate">{sellerInfo.discord}</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            {listing.shipping_locations &&
              listing.shipping_locations.length > 0 && (
                <Card className="border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Truck className="h-5 w-5" />
                      Shipping Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {listing.shipping_locations.map((location, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50/50"
                        >
                          <div className="flex items-center gap-3">
                            {location.isGlobal ? (
                              <Globe className="h-5 w-5 text-blue-600" />
                            ) : (
                              <MapPin className="h-5 w-5 text-green-600" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {location.isGlobal
                                  ? "Global Shipping"
                                  : "Regional Shipping"}
                              </p>
                              {!location.isGlobal && location.countryId && (
                                <p className="text-sm text-gray-500">
                                  {location.countryId}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="font-medium">
                            {location.cost}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
