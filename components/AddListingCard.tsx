import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PhotoUpload } from '@/components/PhotoUpload';
import type { Listing } from '@/app/list/page';

interface AddListingCardProps {
  onAddListing: (listing: Omit<Listing, 'id'>) => void;
}

export const AddListingCard = ({ onAddListing }: AddListingCardProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    productType: '',
    brand: '',
    condition: '',
    images: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.productType) return;

    onAddListing({
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      productType: formData.productType,
      brand: formData.brand,
      condition: formData.condition,
      images: formData.images
    });

    setFormData({
      name: '',
      price: '',
      description: '',
      productType: '',
      brand: '',
      condition: '',
      images: []
    });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      productType: '',
      brand: '',
      condition: '',
      images: []
    });
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <Card 
        className="h-80 border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors bg-white/50 hover:bg-white/80"
        onClick={() => setIsCreating(true)}
      >
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Add New Listing</p>
            <p className="text-sm text-gray-400">Click to create a product listing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
<Card className="h-auto bg-white shadow-lg w-[70em] z-10">
  <CardContent className="p-6">
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Name + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productType">Category *</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, productType: value }))}>
            <SelectTrigger>
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

      {/* Row 2: Price + Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            placeholder="Brand name"
          />
        </div>
      </div>

      {/* Row 3: Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
            <SelectTrigger>
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

      {/* Row 4: Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your product..."
          className="min-h-[80px]"
        />
      </div>

      {/* Row 5: Images */}
      <div className="space-y-2">
        <Label>Images</Label>
        <PhotoUpload
          images={formData.images}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          maxImages={3}
          maxSizeMB={5}
        />
      </div>

      {/* Row 6: Buttons */}
      <div className="flex flex-col md:flex-row gap-3 pt-2">
        <Button type="submit" className="md:flex-1">
          Save Listing
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  </CardContent>
</Card>

  );
};