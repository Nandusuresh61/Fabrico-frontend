
import { useState } from 'react';
import Layout from '../../components/layout/layout';
import ProductCard from '../../components/ui/ProductCard';

// Mock data
const products = [
  {
    id: '1',
    name: 'Vintage Baseball Cap',
    price: 39.99,
    discountPrice: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1536&auto=format&fit=crop',
    rating: 4.5,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Classic Snapback',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1548&auto=format&fit=crop',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Premium Trucker Cap',
    price: 49.99,
    discountPrice: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1470&auto=format&fit=crop',
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Urban Fitted Cap',
    price: 55.99,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1587&auto=format&fit=crop',
    rating: 4.0,
  },
  {
    id: '5',
    name: 'Minimalist Dad Hat',
    price: 35.99,
    discountPrice: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1552060155-4b9a038bc4d3?q=80&w=1587&auto=format&fit=crop',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Sport Performance Cap',
    price: 42.99,
    imageUrl: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1470&auto=format&fit=crop',
    rating: 4.3,
  },
];

const categories = [
  { id: '1', name: 'All Products' },
  { id: '2', name: 'Baseball Caps' },
  { id: '3', name: 'Snapbacks' },
  { id: '4', name: 'Trucker Caps' },
  { id: '5', name: 'Dad Hats' },
  { id: '6', name: 'Fitted Caps' },
];

const brands = [
  { id: '1', name: 'All Brands' },
  { id: '2', name: 'CapCraft' },
  { id: '3', name: 'UrbanLid' },
  { id: '4', name: 'HeadStyle' },
  { id: '5', name: 'StreetCrown' },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('1');
  const [activeBrand, setActiveBrand] = useState('1');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('featured');

  return (
    <Layout>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="mb-8 text-3xl font-bold">Shop Caps</h1>
        
        <div className="grid gap-8 md:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-6 md:col-span-1">
            {/* Category Filter */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`block w-full text-left text-sm ${
                      activeCategory === category.id ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Brand Filter */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-medium">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setActiveBrand(brand.id)}
                    className={`block w-full text-left text-sm ${
                      activeBrand === brand.id ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="mt-2 w-full cursor-pointer"
              />
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Sorting */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">{products.length} products</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            
            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                  &lt;
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-white">
                  1
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                  2
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                  3
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
