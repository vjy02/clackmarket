"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Info, CircleDollarSign, Text, ImageIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PhotoUpload } from "@/components/PhotoUpload"
import type { Listing } from "@/app/list/page"

interface AddListingFormProps {
  onAddListing: (listing: Omit<Listing, "id">) => void
}

export const AddListingForm = ({ onAddListing }: AddListingFormProps) => {
  const [errors, setErrors] = useState<{
    name?: string
    price?: string
    brand?: string
    description?: string
    images?: string
  }>({})

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    product_type: "",
    brand: "",
    condition: "",
    images: [] as File[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required."
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required."
    }

    const priceValue = Number.parseFloat(formData.price)
    if (!formData.price || isNaN(priceValue) || priceValue < 0 || priceValue > 99999) {
      newErrors.price = "Price must be a number between 0 and 99999."
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required."
    } else {
      const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length
      const charCount = formData.description.trim().length

      if (wordCount > 100) {
        newErrors.description = "Description must be 100 words or fewer."
      } else if (charCount > 1000) {
        newErrors.description = "Description must be under 1000 characters."
      }
    }

    if (formData.images.length < 1) {
      newErrors.images = "Upload at least 1 image."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    onAddListing({
      name: formData.name,
      price: priceValue,
      description: formData.description,
      product_type: formData.product_type,
      brand: formData.brand,
      condition: formData.condition,
      images: formData.images,
    })

    // Reset form after successful submission
    setFormData({
      name: "",
      price: "",
      description: "",
      product_type: "",
      brand: "",
      condition: "",
      images: [],
    })
  }

  return (
    <Card className="bg-white shadow-lg border border-gray-200 min-w-max">
      <CardContent className="px-6 py-6 max-w-[80vw]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Info className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
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
                                                      <div className="space-y-2 ">
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
                    <div className="flex justify-between w-3/5">
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="product_type" className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <Select
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, product_type: value }))}
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Keyboards">Keyboards</SelectItem>
                        <SelectItem value="Switches">Switches</SelectItem>
                        <SelectItem value="Keycaps">Keycaps</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                                    <div className="space-y-2 w-1/2">
                    <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                      Condition *
                    </Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))} required>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  </div>
                  
                </div>
              </div>
{/* Description Section */}
              <div className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Product Description *
                  </Label>
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
                    className="resize-none h-48"
                    required
                  />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Be descriptive to help buyers understand your product</span>
                    <span>{formData.description.length}/1000</span>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Pricing & Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CircleDollarSign className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Pricing & Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
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
                </div>
              </div>
              
              {/* Images Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Upload Images *</Label>
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

          {/* Action Buttons */}
              <Button type="submit" className="h-11 px-8 order-1 sm:order-2 bg-purple-600 hover:bg-purple-700 absolute bottom-5 right-0 md:bottom-auto md:top-10 md:right-6">
                Create Listing
              </Button>
        </form>
      </CardContent>
    </Card>
  )
}
