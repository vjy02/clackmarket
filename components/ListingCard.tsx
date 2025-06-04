"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "@/components/PhotoUpload";
import type { Listing } from "@/app/list/page";

interface ListingCardProps {
  listing: Listing;
  onUpdate: (id: string, updates: Partial<Listing>) => void;
  onDelete: (id: string) => void;
}

export const ListingCard = ({
  listing,
  onUpdate,
  onDelete,
}: ListingCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: listing.name,
    price: listing.price.toString(),
    description: listing.description,
    productType: listing.productType,
    brand: listing.brand,
    condition: listing.condition,
    images: listing.images,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    brand?: string;
    description?: string;
    images?: string;
  }>({});

  const handleSave = () => {
    const newErrors: typeof errors = {};

    if (!editData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!editData.productType) {
      // Can add optional message later if needed
    }

    if (!editData.brand.trim()) {
      newErrors.brand = "Brand is required.";
    }

    const priceValue = parseFloat(editData.price);
    if (
      !editData.price ||
      isNaN(priceValue) ||
      priceValue < 0 ||
      priceValue > 99999
    ) {
      newErrors.price = "Price must be a number between 0 and 99999.";
    }

    if (!editData.description.trim()) {
      newErrors.description = "Description is required.";
    } else {
      const wordCount = editData.description
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      const charCount = editData.description.trim().length;

      if (!editData.description.trim()) {
        newErrors.description = "Description is required.";
      } else if (wordCount > 100) {
        newErrors.description = "Description must be 100 words or fewer.";
      } else if (charCount > 1000) {
        newErrors.description = "Description must be under 1000 characters.";
      }
    }

    if (editData.images.length < 1) {
      newErrors.images = "Upload at least 1 image.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onUpdate(listing.id, {
      name: editData.name,
      price: parseFloat(editData.price),
      description: editData.description,
      productType: editData.productType,
      brand: editData.brand,
      condition: editData.condition,
      images: editData.images,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: listing.name,
      price: listing.price.toString(),
      description: listing.description,
      productType: listing.productType,
      brand: listing.brand,
      condition: listing.condition,
      images: listing.images,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="bg-white shadow-xl border-0 absolute z-10 top-5 w-[95vw] -left-6 md:left-auto md:w-auto">
        <CardContent className="px-6 pb-6 pt-6">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-medium">
                      01
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Product Name *
                      </Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter product name"
                        className="h-11"
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">•</span>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productType" className="text-sm font-medium text-gray-700">
                        Category *
                      </Label>
                      <Select
                        onValueChange={(value) => setEditData((prev) => ({ ...prev, productType: value }))}
                        required
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keyboards">Keyboards</SelectItem>
                          <SelectItem value="switches">Switches</SelectItem>
                          <SelectItem value="keycaps">Keycaps</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-medium">
                      02
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Pricing & Details</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Price (USD) *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          $
                        </span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={editData.price}
                          onChange={(e) => setEditData((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                          className="h-11 pl-8"
                          required
                        />
                      </div>
                      {errors.price && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">•</span>
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                        Brand *
                      </Label>
                      <Input
                        id="brand"
                        value={editData.brand}
                        onChange={(e) => setEditData((prev) => ({ ...prev, brand: e.target.value }))}
                        placeholder="Brand name"
                        className="h-11"
                        required
                      />
                      {errors.brand && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span className="text-red-500">•</span>
                          {errors.brand}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                        Condition *
                      </Label>
                      <Select
                        onValueChange={(value) => setEditData((prev) => ({ ...prev, condition: value }))}
                        required
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Description Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-medium">
                      03
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      id="description"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your product in detail. Include features, specifications, and any relevant information..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Be descriptive to help buyers understand your product</span>
                      <span>{editData.description.length}/500</span>
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">•</span>
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs font-medium">
                      04
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Upload Images</Label>
                    <PhotoUpload
                      images={editData.images}
                      onImagesChange={(images: any) => setEditData((prev) => ({ ...prev, images }))}
                      maxImages={3}
                      maxSizeMB={5}
                    />
                    <p className="text-xs text-gray-500">
                      Upload up to 3 high-quality images. First image will be used as the main photo.
                    </p>
                    {errors.images && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <span className="text-red-500">•</span>
                        {errors.images}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Full Width */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <Button type="button" variant="outline" onClick={handleCancel} className="h-11 px-8 order-2 sm:order-1">
                  Cancel
                </Button>
                <Button type="submit" className="h-11 px-8 order-1 sm:order-2 bg-purple-600 hover:bg-purple-700">
                  Create Listing
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-80 bg-white shadow-lg hover:shadow-xl transition-shadow relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start w-2/3 overflow-hidden">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">
              {listing.name}
            </h3>
            <p className="text-2xl font-bold text-green-600">
              ${listing.price}
            </p>
          </div>
          <div className="flex gap-1 absolute right-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-2 h-8 w-8"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(listing.id)}
              className="p-2 h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Image Preview */}
        {listing.images.length > 0 && (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(listing.images[0])}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
