import { useEffect, useState } from 'react';
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
  const [cartItems, setCartItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleRemoveClick = (itemId) => {
    setItemToRemove(itemId);
    setShowConfirmModal(true);
  };
  const handleConfirmRemove = async () => {
    if (!itemToRemove) return;
    
    try {
      await dispatch(removeFromCart(itemToRemove)).unwrap();
      await dispatch(getCart()).unwrap();
      
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(getCart());
  }, [dispatch, navigate, user]);

  
  useEffect(() => {
    setCartItems(items);
  }, [items]);

  
  useEffect(() => {
    if (!user) return;

    const refreshCart = async () => {
      try {
        await dispatch(getCart()).unwrap();
      } catch (error) {
        console.error('Error refreshing cart:', error);
      }
    };

    
    const interval = setInterval(refreshCart, 30000);

    return () => clearInterval(interval);
  }, [dispatch, user]);


  const handleUpdateQuantity = async (itemId, newQuantity, stock) => {
    if (newQuantity < 1) return;
    
    if (newQuantity > 10) {
      toast({
        description: "Maximum quantity allowed per purchase is 10 units",
        variant: "destructive",
      });
      return;
    }
   
    if (newQuantity > stock) {
      toast({
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

  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;

 
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const checkAvailability = () => {
    let isAvailable = true;
    let message = '';

    for (const item of items) {
      // check product status
      if(item.product.status !== 'active'){
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) is not available`;
        break;
      }


      if (item.variant.stock < item.quantity) {
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) has insufficient stock. Available: ${item.variant.stock}`;
        break;
      }
      
      // check category status
      if(item.product.category.status === 'blocked'){
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) is not available in this category`;
        break;
      }
      // check varient status
      if(item.variant.status == 'isBlocked'){
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) is currently unavailable`;
        break;
      }
      // check stock
      if(item.variant.stock < item.quantity){
        isAvailable = false;
        message = `${item.product.name} (${item.variant.color}) has insufficient stock. Available: ${item.variant.stock}`;
        break;
      } 
    }
    return { isAvailable, message};
  };

  const handleProceedToCheckout = async () => {
    try {
      // Refresh cart data before proceeding
      const result = await dispatch(getCart()).unwrap();
      
      // Check for blocked products using the refreshed data
      const blockedProducts = result.items.filter(item => 
        item.product.status !== 'active' || 
        item.product.category.status === 'blocked' ||
        item.variant.status === 'isBlocked'
      );

      if (blockedProducts.length > 0) {
        const blockedProduct = blockedProducts[0];
        let message = '';
        
        if (blockedProduct.product.status !== 'active') {
          message = `${blockedProduct.product.name} is not available`;
        } else if (blockedProduct.product.category.status === 'blocked') {
          message = `${blockedProduct.product.name} is not available in this category`;
        } else if (blockedProduct.variant.status === 'isBlocked') {
          message = `${blockedProduct.product.name} (${blockedProduct.variant.color}) is currently unavailable`;
        }

        toast({
         // title: "Error",
          description: message,
          variant: "destructive",
        });
        return;
      }

      // Check stock availability
      const outOfStockItems = result.items.filter(item => item.variant.stock < item.quantity);
      if (outOfStockItems.length > 0) {
        const item = outOfStockItems[0];
        toast({
      //    title: "Error",
          description: `${item.product.name} (${item.variant.color}) has insufficient stock. Available: ${item.variant.stock}`,
          variant: "destructive",
        });
        return;
      }

      // Calculate fresh totals
      const freshSubtotal = result.items.reduce((sum, item) => {
        const price = item.variant.discountPrice || item.variant.price;
        return sum + (price * item.quantity);
      }, 0);

      const freshDeliveryCharge = freshSubtotal > 500 ? 0 : 50;
      const freshTotal = freshSubtotal + freshDeliveryCharge;

      navigate('/checkout', {
        state: {
          items: result.items,
          subtotal: freshSubtotal,
          deliveryCharge: freshDeliveryCharge,
          total: freshTotal,
        }
      });
    } catch (error) {
      toast({
     //   title: "Error",
        description: "Failed to refresh cart data",
        variant: "destructive",
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
                                  disabled={item.quantity >= Math.min(10, item.variant.stock)}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              
                              {/* Add stock status message */}
                              {item.variant.stock === 0 ? (
                                <span className="text-red-500 text-sm">Out of stock</span>
                              ) : item.quantity >= Math.min(10, item.variant.stock) ? (
                                <span className="text-orange-500 text-sm">
                                  {item.quantity >= 10 ? "Maximum purchase limit reached" : "Maximum stock reached"}
                                </span>
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
                          onClick={() => handleRemoveClick(item._id)}
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
                    <span className="text-gray-600">Delivery Charge</span>
                    {subtotal > 500 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>₹{deliveryCharge.toFixed(2)}</span>
                    )}
                  </div>
                  {subtotal > 0 && subtotal <= 500 && (
                    <div className="text-sm text-gray-600">
                      Add items worth ₹{(500 - subtotal).toFixed(2)} more for free delivery
                    </div>
                  )}
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
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium mb-4">Remove Item</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your cart?</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  setItemToRemove(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
