import { useEffect } from 'react';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeFromCart, updateCartQuantity } from '../../redux/features/cartSlice';
import { useToast } from '../../hooks/use-toast';

import Loader from '../../components/layout/Loader'

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items, loading, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(getCart());
  }, [dispatch, navigate, user]);

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity, stock) => {
    if (newQuantity < 1) return;
    
    // Add stock validation
    if (newQuantity > stock) {
      toast({
        title: "Error",
        description: "Requested quantity exceeds available stock",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await dispatch(updateCartQuantity({ itemId, quantity: newQuantity })).unwrap();
      toast({
        title: "Success",
        description: "Quantity updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant.discountPrice || item.variant.price;
    return sum + (price * item.quantity);
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Add this click handler function
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const checkAvailability = () => {
    let isAvailable = true;
    let message = '';

    for (const item of items) {
      if (item.variant.stock < item.quantity) {
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) has insufficient stock. Available: ${item.variant.stock}`;
        break;
      }
      if (item.variant.stock === 0) {
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) is out of stock`;
        break;
      }
    }

    if (!isAvailable) {
      toast({
        title: "Stock Issue",
        description: message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleProceedToCheckout = () => {
    if (checkAvailability()) {
      navigate('/checkout', { 
        state: { 
          cartItems: items,
          orderSummary: {
            subtotal,
            tax,
            total
          }
        } 
      });
    }
  };

  if (loading) {
    return (
      <Layout>

        <div className="col-span-full flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>

      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild variant="default">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left side */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-1">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center p-4 border-b last:border-b-0 gap-4"
                  >
                    {/* Make the image and product name clickable */}
                    <div 
                      onClick={() => handleProductClick(item.product._id)}
                      className="cursor-pointer group"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                        <img
                          src={item.variant.mainImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 
                            onClick={() => handleProductClick(item.product._id)}
                            className="text-base font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </h3>
                          <div className="mt-1 text-sm text-gray-500 space-y-1">
                            <p>Brand: {item.product.brand?.name}</p>
                            <p>Category: {item.product.category?.name}</p>
                            <p>Color: {item.variant.color}</p>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="mr-2">Quantity:</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, item.variant.stock)}
                                  className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, item.variant.stock)}
                                  className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity >= item.variant.stock}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              
                              {/* Add stock status message */}
                              {item.variant.stock === 0 ? (
                                <span className="text-red-500 text-sm">Out of stock</span>
                              ) : item.quantity >= item.variant.stock ? (
                                <span className="text-orange-500 text-sm">Maximum stock reached</span>
                              ) : item.variant.stock <= 5 ? (
                                <span className="text-orange-500 text-sm">Only {item.variant.stock} items left</span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                ₹{item.variant.discountPrice || item.variant.price}
                              </span>
                              {item.variant.discountPrice && (
                                <>
                                  <span className="text-gray-400 line-through">₹{item.variant.price}</span>
                                  <span className="text-green-600 text-sm">
                                    {Math.round(((item.variant.price - item.variant.discountPrice) / item.variant.price) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:text-right">
                          <span className="font-medium text-lg">
                           Total: ₹{(item.variant.discountPrice || item.variant.price) * item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between mt-3 gap-3">
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  size="lg"
                  asChild
                >
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
