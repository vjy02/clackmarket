import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/data/keyboards';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⌨️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  const getProductTypeEmoji = (type: string) => {
    switch (type) {
      case 'keyboard': return '⌨️';
      case 'switches': return '🔘';
      case 'keycaps': return '🎯';
      case 'accessories': return '🛠️';
      default: return '⌨️';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </Button>
            {product.isNew && (
              <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">
                New
              </Badge>
            )}
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-xs font-medium text-gray-700">
                {getProductTypeEmoji(product.productType)} {product.productType}
              </span>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-gray-900">${product.price}</p>
                <p className="text-xs text-gray-500">{product.country}</p>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex gap-2 mb-4">
              {product.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
            
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
