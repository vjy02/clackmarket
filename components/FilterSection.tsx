"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, ArrowUpDown, FilterIcon } from "lucide-react";

interface Filters {
  searchTerm: string;
  productType: string;
  region: string | null; // changed from number to string
  isGlobal: boolean;
  sortBy: string;
}

interface FilterSectionProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export const productTypes = ['Keyboards', 'Switches', 'Keycaps', 'Accessories', 'Miscellaneous'];

export const FilterSection = ({ filters, setFilters }: FilterSectionProps) => {
  const handleFilterChange = (
    key: keyof Filters,
    value: string | boolean | null
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      productType: "",
      region: null,
      isGlobal: false,
      sortBy: "",
    });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.productType ||
    filters.region ||
    filters.isGlobal ||
    filters.sortBy;

  return (
    <Card className="sticky top-24 shadow-xl bg-white/80 backdrop-blur-sm border ">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold  flex gap-2 items-center">
            <FilterIcon className="h-5 " />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 absolute right-4"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              handleFilterChange("sortBy", value === "default" ? "" : value)
            }
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low-high" className="hover:bg-gray-50">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high-low" className="hover:bg-gray-50">
                Price: High to Low
              </SelectItem>
              <SelectItem value="newest-first" className="hover:bg-gray-50">
                Newest First
              </SelectItem>
              <SelectItem value="oldest-first" className="hover:bg-gray-50">
                Oldest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Product Type
          </label>
          <Select
            value={filters.productType}
            onValueChange={(value) =>
              handleFilterChange("productType", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder="All products" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All products</SelectItem>
              {productTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="hover:bg-gray-50"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Region
          </label>
          <Select
            value={filters.region ?? ""}
            onValueChange={(value) =>
              handleFilterChange("region", value === "" ? null : value)
            }
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Asia">Asia</SelectItem>
              <SelectItem value="Oceania">Oceania</SelectItem>
              <SelectItem value="United States of America">
                United States of America
              </SelectItem>
              <SelectItem value="United States of America">Canada</SelectItem>
              <SelectItem value="South America">South America</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Global Shipping */}
        {/* <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isGlobal"
              checked={filters.isGlobal}
              onCheckedChange={(checked) =>
                handleFilterChange("isGlobal", checked as boolean)
              }
              className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label
              htmlFor="isGlobal"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Global shipping available
            </label>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};
