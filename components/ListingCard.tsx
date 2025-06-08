"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ImageIcon, Tag, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export interface Listing {
  id: string
  name: string
  price: number
  description: string
  productType: string
  brand: string
  condition: string
  images: string[]
  username: string
  seller_id: string
  link: string
}

interface ListingCardProps {
  listing: Listing
  onDelete: (id: string) => void
}

// Helper function to get condition badge color
const getConditionColor = (condition: string) => {
  const conditionMap: Record<string, string> = {
    new: "bg-green-100 text-green-800 border-green-200",
    "like new": "bg-emerald-100 text-emerald-800 border-emerald-200",
    excellent: "bg-blue-100 text-blue-800 border-blue-200",
    good: "bg-yellow-100 text-yellow-800 border-yellow-200",
    fair: "bg-orange-100 text-orange-800 border-orange-200",
    poor: "bg-red-100 text-red-800 border-red-200",
  }

  return conditionMap[condition?.toLowerCase() ?? "New"] || "bg-gray-100 text-gray-800 border-gray-200"
}

export const ListingCard = ({ listing, onDelete }: ListingCardProps) => {
  const imageUrl = listing.images.length > 0 ? listing.images[0] : "/placeholder.svg?height=300&width=400"
    console.log(listing)
    const router = useRouter();
  return (
    <Card onClick={()=>router.push("/item/"+listing.id)} className="hover:cursor-pointer group overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {listing.images.length > 0 ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={listing.name}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Delete Button Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(listing.id)
            }}
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

        {/* Image Count Badge */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            +{listing.images.length - 1}
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4 space-y-3">
        {/* Seller Info */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium">@{listing.username}</span>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
          <Tag className="w-3.5 h-3.5" />
          {listing.brand}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {listing.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">${listing.price.toLocaleString()}</span>
        </div>

        {/* Footer with additional details */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-xs bg-gray-50 px-2 py-1 rounded-md text-gray-600 font-medium">
              {listing.productType}
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-md font-medium ${getConditionColor(listing.condition)}`}>
            {listing.condition}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
