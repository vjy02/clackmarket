import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { countries, brands, productTypes } from '@/data/keyboards';

interface Filters {
  country: string;
  priceRange: [number, number];
  brand: string;
  searchTerm: string;
  productType: string;
}

interface FilterSectionProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export const FilterSection = ({ filters, setFilters }: FilterSectionProps) => {
  const handleFilterChange = (key: keyof Filters, value: string | number | [number, number]) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      priceRange: [0, 1000],
      brand: '',
      searchTerm: '',
      productType: '',
    });
  };

  const hasActiveFilters = filters.country || filters.brand || filters.searchTerm || filters.productType ||
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000;

  return (
    <Card className="sticky top-24 shadow-lg border-0 bg-white/80 backdrop-blur-sm" >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 absolute right-4"
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
          <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Product Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Product Type</label>
          <Select value={filters.productType} onValueChange={(value) => handleFilterChange('productType', value === 'all' ? '' : value)}>
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder="All products" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All products</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Country</label>
          <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value === 'all' ? '' : value)}>
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Brand</label>
          <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value === 'all' ? '' : value)}>
            <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
            max={1000}
            min={0}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};