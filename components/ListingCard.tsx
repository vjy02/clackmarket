'use client'

import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PhotoUpload } from '@/components/PhotoUpload';
import type { Listing } from '@/app/list/page';

interface ListingCardProps {
  listing: Listing;
  onUpdate: (id: string, updates: Partial<Listing>) => void;
  onDelete: (id: string) => void;
}

export const ListingCard = ({ listing, onUpdate, onDelete }: ListingCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: listing.name,
    price: listing.price.toString(),
    description: listing.description,
    productType: listing.productType,
    brand: listing.brand,
    condition: listing.condition,
    images: listing.images
  });

  const handleSave = () => {
    onUpdate(listing.id, {
      name: editData.name,
      price: parseFloat(editData.price),
      description: editData.description,
      productType: editData.productType,
      brand: editData.brand,
      condition: editData.condition,
      images: editData.images
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: listing.name,
      price: listing.price.toString(),
      description: listing.description,
      productType: listing.productType,
      brand: listing.brand,
      condition: listing.condition,
      images: listing.images
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
<Card className="h-auto bg-white shadow-lg absolute z-10">
  <CardContent className="p-6">
    <form onSubmit={handleSave} className="space-y-6">
      {/* Row 1: Name + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productType">Category *</Label>
          <Select onValueChange={(value) => setEditData(prev => ({ ...prev, productType: value }))}>
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
            value={editData.price}
            onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={editData.brand}
            onChange={(e) => setEditData(prev => ({ ...prev, brand: e.target.value }))}
            placeholder="Brand name"
          />
        </div>
      </div>

      {/* Row 3: Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select onValueChange={(value) => setEditData(prev => ({ ...prev, condition: value }))}>
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
          value={editData.description}
          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your product..."
          className="min-h-[80px]"
        />
      </div>

      {/* Row 5: Images */}
      <div className="space-y-2">
        <Label>Images</Label>
        <PhotoUpload
          images={editData.images}
          onImagesChange={(images) => setEditData(prev => ({ ...prev, images }))}
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
  }

  return (
    <Card className="h-80 bg-white shadow-lg hover:shadow-xl transition-shadow relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start w-2/3 overflow-hidden">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">{listing.name}</h3>
            <p className="text-2xl font-bold text-green-600">${listing.price}</p>
          </div>
          <div className="flex gap-1 absolute right-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-2 h-8 w-8"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(listing.id)}
              className="p-2 h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Image Preview */}
        {listing.images.length > 0 && (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(listing.images[0])}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {listing.productType}
          </Badge>
          {listing.brand && (
            <Badge variant="outline" className="text-xs">
              {listing.brand}
            </Badge>
          )}
          {listing.condition && (
            <Badge variant="outline" className="text-xs">
              {listing.condition}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
