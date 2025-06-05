import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  brand: string
  image: string
  seller: string // username
}

interface ProductGridProps {
  products: Product[]
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⌨️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
        >
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg?height=200&width=300"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-gray-900">${product.price}</p>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <User className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">{product.seller}</span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-800">
              View Listing
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
