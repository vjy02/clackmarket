
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  country: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  productType: 'keyboard' | 'switches' | 'keycaps' | 'accessories';
  isNew?: boolean;
  seller: string;
}

export const products: Product[] = [
  // Keyboards
  {
    id: '1',
    name: 'MX Master Pro',
    brand: 'Keychron',
    price: 299,
    country: 'China',
    rating: 4.8,
    reviews: 1254,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    description: 'Premium mechanical keyboard with hot-swappable switches and RGB backlighting.',
    features: ['Hot-swappable', 'RGB', 'Wireless', 'Aluminum Frame'],
    productType: 'keyboard',
    isNew: true,
    seller: "John Smith",
  },
  {
    id: '2',
    name: 'Elite Gaming RGB',
    brand: 'Corsair',
    price: 179,
    country: 'USA',
    rating: 4.6,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    description: 'High-performance gaming keyboard with Cherry MX switches and customizable RGB.',
    features: ['Cherry MX', 'RGB', 'Gaming', 'Macro Keys'],
    productType: 'keyboard',
    seller: "John Smith",
  },
  {
    id: '3',
    name: 'Silent Productivity',
    brand: 'Logitech',
    price: 129,
    country: 'Switzerland',
    rating: 4.4,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1518544866330-4e716499f800?w=400&h=300&fit=crop',
    description: 'Quiet mechanical keyboard perfect for office environments with tactile feedback.',
    features: ['Silent', 'Tactile', 'Wireless', 'Long Battery'],
    productType: 'keyboard',
    seller: "John Smith",
  },
  {
    id: '4',
    name: 'Artisan Custom',
    brand: 'Drop',
    price: 449,
    country: 'USA',
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=300&fit=crop',
    description: 'Handcrafted mechanical keyboard with premium materials and custom keycaps.',
    features: ['Handcrafted', 'Premium', 'Custom Keycaps', 'Limited Edition'],
    productType: 'keyboard',
    isNew: true,
    seller: "John Smith",
  },
  {
    id: '5',
    name: 'Compact 65%',
    brand: 'Anne Pro',
    price: 89,
    country: 'China',
    rating: 4.3,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Compact 65% layout keyboard with Bluetooth connectivity and RGB lighting.',
    features: ['65% Layout', 'Bluetooth', 'RGB', 'Portable'],
    productType: 'keyboard',
    seller: "John Smith",
  },

  // Switches
  {
    id: '6',
    name: 'Cherry MX Red',
    brand: 'Cherry',
    price: 45,
    country: 'Germany',
    rating: 4.7,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    description: 'Linear mechanical switches perfect for gaming with smooth keystrokes.',
    features: ['Linear', 'Smooth', 'Gaming', '45g Force'],
    productType: 'switches',
    seller: "John Smith",
  },
  {
    id: '7',
    name: 'Gateron Yellow',
    brand: 'Gateron',
    price: 32,
    country: 'China',
    rating: 4.5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Affordable linear switches with excellent build quality and smooth feel.',
    features: ['Linear', 'Budget-Friendly', 'Smooth', '50g Force'],
    productType: 'switches',
    isNew: true,
    seller: "John Smith",
  },
  {
    id: '8',
    name: 'Holy Panda',
    brand: 'Drop',
    price: 89,
    country: 'USA',
    rating: 4.9,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1518544866330-4e716499f800?w=400&h=300&fit=crop',
    description: 'Premium tactile switches with crisp bump and satisfying sound.',
    features: ['Tactile', 'Premium', 'Crisp Bump', '67g Force'],
    productType: 'switches',
    seller: "John Smith",
  },

  // Keycaps
  {
    id: '9',
    name: 'GMK Laser',
    brand: 'GMK',
    price: 159,
    country: 'Germany',
    rating: 4.8,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&h=300&fit=crop',
    description: 'Premium double-shot ABS keycaps with retro-futuristic design.',
    features: ['Double-shot ABS', 'Cherry Profile', 'Retro Design', 'Legends'],
    productType: 'keycaps',
    seller: "John Smith",
  },
  {
    id: '10',
    name: 'Tai-Hao Sunshine',
    brand: 'Tai-Hao',
    price: 35,
    country: 'Taiwan',
    rating: 4.3,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    description: 'Vibrant PBT keycaps with excellent durability and bright colors.',
    features: ['PBT Material', 'Dye-sublimated', 'OEM Profile', 'Colorful'],
    productType: 'keycaps',
    seller: "John Smith",
  },

  // Accessories
  {
    id: '11',
    name: 'Wrist Rest Premium',
    brand: 'Glorious',
    price: 29,
    country: 'USA',
    rating: 4.4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    description: 'Ergonomic wrist rest with memory foam and premium fabric cover.',
    features: ['Memory Foam', 'Ergonomic', 'Anti-slip', 'Machine Washable'],
    productType: 'accessories',
    seller: "John Smith",
  },
  {
    id: '12',
    name: 'Switch Puller Tool',
    brand: 'Drop',
    price: 12,
    country: 'USA',
    rating: 4.6,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Essential tool for removing switches from hot-swappable keyboards.',
    features: ['Durable Metal', 'Easy Grip', 'Compatible', 'Essential Tool'],
    productType: 'accessories',
    seller: "John Smith",
  },
];

// Keep backwards compatibility
export const keyboards = products.filter(p => p.productType === 'keyboard');

export const countries = [...new Set(products.map(p => p.country))].sort();
export const brands = [...new Set(products.map(p => p.brand))].sort();
