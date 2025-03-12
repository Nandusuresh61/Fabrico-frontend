
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../..//components/ui/CustomButton';
import ProductCard from '../../components/ui/ProductCard';

// Mock product data
const product = {
  id: '1',
  name: 'Vintage Baseball Cap',
  price: 39.99,
  discountPrice: 29.99,
  description: 'A premium quality baseball cap crafted with durable materials for everyday comfort and style. Features adjustable strap for perfect fit.',
  rating: 4.5,
  reviews: 128,
  colors: ['Black', 'Navy', 'Olive', 'Burgundy'],
  images: [
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1536&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1548&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1470&auto=format&fit=crop',
  ],
  brand: 'CapCraft',
  sku: 'CC-VBC-001',
  inStock: true,
};

// Mock similar products
const similarProducts = [
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
  },
  {
    id: '4',
    name: 'Urban Fitted Cap',
    price: 55.99,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1587&auto=format&fit=crop',
    rating: 4.0,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <Layout>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                    mainImage === image ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <span className="text-sm text-gray-500">Brand: {product.brand}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              {product.discountPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${product.discountPrice}</span>
                    <span className="text-lg text-gray-500 line-through">${product.price}</span>
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold">${product.price}</span>
              )}
              <p className="text-sm text-green-600">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            
            <p className="text-gray-700">{product.description}</p>
            
            <div>
              <label className="mb-2 block font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      selectedColor === color
                        ? 'border-primary bg-primary/5 font-medium text-primary'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="mb-2 block font-medium">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-l-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-16 border-y border-gray-300 text-center outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-r-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <CustomButton icon={<ShoppingCart className="h-4 w-4" />}>
                Add to Cart
              </CustomButton>
              <CustomButton variant="outline" icon={<Heart className="h-4 w-4" />}>
                Add to Wishlist
              </CustomButton>
            </div>
            
            <div className="border-t border-gray-200 pt-4 text-sm text-gray-600">
              <p>SKU: {product.sku}</p>
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        <div className="border-t border-gray-200 pt-10">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
