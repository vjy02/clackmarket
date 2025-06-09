"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Package,
  Star,
  User,
  Mail,
  Phone,
  MessageCircle,
  Globe,
  Truck,
  AlertCircle,
  Share,
  Flag,
} from "lucide-react";

import type { Listing } from "@/types";

export default function ItemPage() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const listingId = params.id as string;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/item-single?id=${listingId}`);
        if (!res.ok) throw new Error("Failed to fetch listing.");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError("Failed to load listing. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (listingId) fetchListing();
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

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800 border-green-200";
      case "like new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "good":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "fair":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                className="w-full h-full object-cover"
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
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50"
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

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  Brand: {listing.brand}
                </span>
              </div>
              <Badge
                className={`${getConditionColor(
                  listing.condition
                )} font-medium`}
              >
                {listing.condition}
              </Badge>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Description
              </h3>
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
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {listing.seller_username}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {listing.seller_username}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
                      <span className="text-sm text-gray-500 ml-1 font-medium">
                        (4.2)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                    asChild
                  >
                    <a href={`mailto:seller@example.com`}>
                      <Mail className="h-4 w-4" />
                      <span className="truncate">seller@example.com</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                    asChild
                  >
                    <a href={`tel:+1234567890`}>
                      <Phone className="h-4 w-4" />
                      <span className="truncate">(123) 456-7890</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                    asChild
                  >
                    <a
                      href={`https://reddit.com/u/seller_username`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="truncate">u/seller_username</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                    asChild
                  >
                    <a
                      href={`https://discord.com/users/seller_username`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="truncate">seller_username#1234</span>
                    </a>
                  </Button>
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
