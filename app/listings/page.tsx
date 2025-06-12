"use client"

import { useEffect, useState } from "react"
import { ListingCard } from "@/components/ListingCard"
import { useToast } from "@/lib/useToast"
import { PlusCircle, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
  created_at: string
}

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/item-update")
        if (res.ok) {
          const data = await res.json()
          setListings(data)
        } else {
          toast({
            title: "Failed to fetch listings",
            description: "Please try again later.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong while fetching your listings.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [toast])

  const deleteListing = async (id: string) => {
    const res = await fetch(`/api/item-update?id=${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      setListings((prev) => prev.filter((listing) => listing.id !== id))
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully removed.",
      })
    } else {
      toast({
        title: "Failed to delete listing",
        description: "Try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-[93vh] bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2 font-extrabold">My Listings</h1>
            <p className="text-gray-600">Manage your product listings currently live on the marketplace.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className=" text-gray-600">Loading listings...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg shadow-sm">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No listings yet</h2>
            <p className="text-gray-600 max-w-md mb-6">
              You haven't created any listings yet. Start selling by creating your first listing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onDelete={deleteListing} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MyListings
