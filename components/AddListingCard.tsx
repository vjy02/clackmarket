import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  CircleDollarSign,
  Text,
  Image as ImageIcon,
} from "lucide-react";
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

interface AddListingCardProps {
  onAddListing: (listing: Omit<Listing, "id">) => void;
}

export const AddListingCard = ({ onAddListing }: AddListingCardProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    brand?: string;
    description?: string;
    images?: string;
  }>({});

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    productType: "",
    brand: "",
    condition: "",
    images: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!formData.productType) {
      // Can add optional message later if needed
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required.";
    }

    const priceValue = parseFloat(formData.price);
    if (
      !formData.price ||
      isNaN(priceValue) ||
      priceValue < 0 ||
      priceValue > 99999
    ) {
      newErrors.price = "Price must be a number between 0 and 99999.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else {
      const wordCount = formData.description
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      const charCount = formData.description.trim().length;

      if (!formData.description.trim()) {
        newErrors.description = "Description is required.";
      } else if (wordCount > 100) {
        newErrors.description = "Description must be 100 words or fewer.";
      } else if (charCount > 1000) {
        newErrors.description = "Description must be under 1000 characters.";
      }
    }

    if (formData.images.length < 1) {
      newErrors.images = "Upload at least 1 image.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onAddListing({
      name: formData.name,
      price: priceValue,
      description: formData.description,
      productType: formData.productType,
      brand: formData.brand,
      condition: formData.condition,
      images: formData.images,
    });

    setFormData({
      name: "",
      price: "",
      description: "",
      productType: "",
      brand: "",
      condition: "",
      images: [],
    });

    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      productType: "",
      brand: "",
      condition: "",
      images: [],
    });
    setErrors({});
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <Card
        className="h-80 border-2 border-dashed border-gray-300 hover:border-gray-600 cursor-pointer transition-colors bg-white/50 hover:bg-white/80"
        onClick={() => setIsCreating(true)}
      >
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Add New Listing</p>
            <p className="text-sm text-gray-400">
              Click to create a product listing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
      <Card className="bg-white shadow-xl border-0 absolute z-10 top-5 w-[95vw] -left-6 md:left-auto md:w-auto">
        <CardContent className="px-6 pb-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Info className=" text-blue-600"/>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Product Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, productType: value }))}
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
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="text-green-600"/>
                    <h3 className="text-lg font-semibold text-gray-900">Pricing & Details</h3>
                  </div>

                  <div className="space-y-5">
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
                          value={formData.price}
                          onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
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
                        value={formData.brand}
                        onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
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
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
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
              <div className="space-y-6">
                {/* Description Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Text className="text-orange-600"/>
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      <span>{formData.description.length}/500</span>
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
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Upload Images</Label>
                    <PhotoUpload
                      images={formData.images}
                      onImagesChange={(images: any) => setFormData((prev) => ({ ...prev, images }))}
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
};
