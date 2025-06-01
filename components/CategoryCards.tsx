import { Card, CardContent } from "@/components/ui/card";
import { Keyboard, Settings, Palette, Wrench } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  productCount: number;
  gradient: string;
}

const categories: Category[] = [
  {
    id: "keyboard",
    name: "Keyboards",
    icon: Keyboard,
    description: "Premium mechanical keyboards for every typing style",
    productCount: 5,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: "switches",
    name: "Switches",
    icon: Settings,
    description: "Tactile, linear, and clicky switches for custom builds",
    productCount: 3,
    gradient: "from-green-500 to-teal-600",
  },
  {
    id: "keycaps",
    name: "Keycaps",
    icon: Palette,
    description: "Beautiful keycap sets to personalize your keyboard",
    productCount: 2,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Wrench,
    description: "Essential tools and accessories for keyboard enthusiasts",
    productCount: 2,
    gradient: "from-orange-500 to-amber-600",
  },
];

export const CategoryCards = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover everything you need to build your perfect mechanical
            keyboard setup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden hover:-translate-y-2"
              >
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${category.gradient} p-8 text-white relative overflow-hidden`}
                  >
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    <IconComponent className="w-12 h-12 mb-4 relative z-10" />
                    <h3 className="text-2xl font-bold mb-2 relative z-10">
                      {category.name}
                    </h3>
                    <div className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block relative z-10">
                      {category.productCount} products
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                      Explore Collection →
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
