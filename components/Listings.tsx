"use client";

import { useEffect, useState } from "react";
import { FilterSection } from "@/components/FilterSection";
import { ListingCard } from "./ListingCard";

interface Filters {
  searchTerm: string;
  productType: string;
  region: string;
  isGlobal: boolean;
  sortBy: string;
}

const LIMIT = 15;

export const Listings = ({ disableFilters }: { disableFilters: boolean }) => {
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    productType: "",
    region: "",
    isGlobal: false,
    sortBy: "",
  });

  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchListings = async (reset = false, pageNumber = 0) => {
    const currentPage = reset ? 0 : pageNumber;
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: LIMIT.toString(),
      ...(filters.region && { region: filters.region }),
      ...(filters.productType && { productType: filters.productType }),
      ...(filters.searchTerm && { search: filters.searchTerm }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.isGlobal && { isGlobal: "true" }),
    });

    setIsFetching(true);

    try {
      const res = await fetch(`/api/item-fetch?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        if (reset) {
          setVisibleProducts(data);
          setPage(1);
        } else {
          setVisibleProducts((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        }

        setHasMore(data.length === LIMIT);
      } else {
        console.error("Failed to fetch listings", data.error);
      }
    } finally {
      setIsFetching(false);
      setIsFirstLoad(false); // mark first load done
    }
  };

  // Reset page and fetch when filters change
  useEffect(() => {
    setPage(0);
    fetchListings(true, 0);
  }, [filters]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      fetchListings(false, page);
    }
  };
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recent Listings
              </h2>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ListingCard
                key={product.id}
                listing={product}
                onDelete={false}
              />
            ))}
          </div>
          {isFirstLoad ? (
            <div className="flex justify-center mt-8">
              <span className="text-gray-600">Loading listings...</span>
            </div>
          ) : (
            hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isFetching}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isFetching ? "Loading..." : "Load More"}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
};
