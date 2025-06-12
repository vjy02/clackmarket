"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FilterSection } from "@/components/FilterSection"
import { ListingCard } from "./ListingCard"
import { Button } from "./ui/button"

interface Filters {
  searchTerm: string
  productType: string
  region: string
  isGlobal: boolean
  sortBy: string
}

const LIMIT = 15
const PREVIEW_LIMIT = 8

export const Listings = ({ disableFilters }: { disableFilters: boolean }) => {
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    productType: "",
    region: "",
    isGlobal: false,
    sortBy: "",
  })

  const [visibleProducts, setVisibleProducts] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const fetchListings = async (reset = false, pageNumber = 0) => {
    const currentPage = reset ? 0 : pageNumber
    const currentLimit = disableFilters ? PREVIEW_LIMIT : LIMIT

    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: currentLimit.toString(),
      ...(filters.region && { region: filters.region }),
      ...(filters.productType && { productType: filters.productType }),
      ...(filters.searchTerm && { search: filters.searchTerm }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.isGlobal && { isGlobal: "true" }),
      // When disableFilters is true, always sort by most recent
      ...(disableFilters && { sortBy: "newest" }),
    })

    setIsFetching(true)

    try {
      const res = await fetch(`/api/item-fetch?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        if (reset) {
          setVisibleProducts(data)
          setPage(1)
        } else {
          setVisibleProducts((prev) => [...prev, ...data])
          setPage((prev) => prev + 1)
        }

        // When disableFilters is true, we don't need pagination
        setHasMore(disableFilters ? false : data.length === LIMIT)
      } else {
        console.error("Failed to fetch listings", data.error)
      }
    } finally {
      setIsFetching(false)
      setIsFirstLoad(false)
    }
  }

  // Reset page and fetch when filters change
  useEffect(() => {
    setPage(0)
    fetchListings(true, 0)
  }, [filters, disableFilters])

  const loadMore = () => {
    if (!isFetching && hasMore && !disableFilters) {
      fetchListings(false, page)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {!disableFilters && (
          <aside className="lg:w-80">
            <FilterSection filters={filters} setFilters={setFilters} />
          </aside>
        )}
        <div className="flex-1">
          {disableFilters && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Listings</h2>
              <p className="text-gray-600">Check out our latest marketplace offerings</p>
            </div>
          )}

          <div className={`relative ${disableFilters ? "overflow-hidden h-4/12" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product, index) => {
                const isSecondRow = index >= 4
                return (
                  <div key={product.id} className={`${disableFilters && isSecondRow ? "pointer-events-none" : ""}`}>
                    <ListingCard listing={product} onDelete={false} />
                  </div>
                )
              })}
            </div>

            {/* Fade overlay and CTA positioned over second row */}
            {disableFilters && visibleProducts.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent flex justify-center items-end">
                <div className="text-center mb-16 flex flex-col gap-2 justify-center items-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">Want to see more?</h3>
                  <p className="text-gray-600 mb-4">Explore our full marketplace with our full range of listings</p>
                  <Link
                    href="/search"
                    className="group relative overflow-hidden px-8 py-3  bg-blue-600  text-white rounded-lg font-medium shadow-lg"
                  >
                    <span className="relative z-10">Discover more</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Loading and Load More for full listings */}
          {!disableFilters && (
            <>
              {isFirstLoad ? (
                <div className="flex justify-center mt-8">
                  <span className="text-gray-600">Loading listings...</span>
                </div>
              ) : (
                hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={loadMore}
                      disabled={isFetching}
                      className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isFetching ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )
              )}
            </>
          )}

          {/* Loading state for preview mode */}
          {disableFilters && isFirstLoad && (
            <div className="flex justify-center mt-8">
              <span className="text-gray-600">Loading recent listings...</span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
