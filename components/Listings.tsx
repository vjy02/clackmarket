"use client";

import { useState } from "react";
import { FilterSection } from "@/components/FilterSection";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/keyboards";

interface Filters {
  country: string;
  priceRange: [number, number];
  brand: string;
  searchTerm: string;
  productType: string;
}

export const Listings = ({ disableFilters }: { disableFilters: boolean }) => {
  const [filters, setFilters] = useState<Filters>({
    country: "",
    priceRange: [0, 1000],
    brand: "",
    searchTerm: "",
    productType: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesCountry =
      !filters.country || product.country === filters.country;
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesProductType =
      !filters.productType || product.productType === filters.productType;
    const matchesSearch =
      !filters.searchTerm ||
      product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.productType
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    return (
      matchesCountry &&
      matchesPrice &&
      matchesBrand &&
      matchesProductType &&
      matchesSearch
    );
  });

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
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </main>
  );
};
