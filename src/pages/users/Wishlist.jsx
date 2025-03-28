import { useState } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

// Mock data for wishlist items
const initialWishlistItems = [
  {
    id: '1',
    name: 'Premium Fitted Cap',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    price: 29.99,
    brand: 'CapHaven',
    availability: 'In Stock',
  },
  {
    id: '4',
    name: 'Classic Baseball Cap',
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    price: 22.99,
    brand: 'SportsCap',
    availability: 'In Stock',
  },
  {
    id: '5',
    name: 'Summer Straw Hat',
    imageUrl: 'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    price: 34.99,
    brand: 'SummerStyle',
    availability: 'Low Stock',
  },
  {
    id: '6',
    name: 'Wool Fedora',
    imageUrl: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    price: 39.99,
    brand: 'ClassicHats',
    availability: 'Out of Stock',
  }
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  // Handle item removal
  const removeItem = (id) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Check if wishlist is empty
  const isWishlistEmpty = wishlistItems.length === 0;

  return (
    <Layout>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        
        {isWishlistEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist and they'll appear here.</p>
            <Button asChild variant="default">
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative group"
              >
                {/* Remove button (absolute positioned) */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-5 w-5" />
                </button>
                
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 pr-8 sm:pr-0">
                  <h3 className="text-base font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Brand: {item.brand}</p>
                  <div className="mt-1">
                    <span 
                      className={`text-sm px-2 py-0.5 rounded-full ${
                        item.availability === 'In Stock' 
                          ? 'bg-green-50 text-green-700' 
                          : item.availability === 'Low Stock'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {item.availability}
                    </span>
                  </div>
                </div>
                
                {/* Price and Add to Cart */}
                <div className="mt-4 sm:mt-0 w-full sm:w-auto flex flex-col sm:items-end gap-2">
                  <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="sm:w-auto w-full"
                    disabled={item.availability === 'Out of Stock'}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
