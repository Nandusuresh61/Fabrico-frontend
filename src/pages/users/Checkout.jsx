import { useState, useEffect } from 'react';
import { Check, CreditCard, MapPin, Pencil, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cartSlice';
import { fetchAddresses, addNewAddress, updateExistingAddress } from '../../redux/features/addressSlice';
import { updateProductStockApi } from '../../api/productApi';
import Modal from '../../components/ui/Modal';
import CustomButton from '../../components/ui/CustomButton';
import { Home, Briefcase } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { createOrder } from '../../redux/features/orderSlice';
import { getAvailableCoupons, validateCoupon, markCouponAsUsed } from '../../api/couponApi';
import { processPayment, createRazorpayOrder } from '../../services/paymentService';


const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, subtotal: cartSubtotal, deliveryCharge, total: cartTotal } = location.state || {
    items: [],
    subtotal: 0,
    deliveryCharge: 0,
    total: 0
  };
  const orderSummary = {
    subtotal: cartSubtotal,
    deliveryCharge: deliveryCharge,
    total: cartTotal
  };
  const { addresses } = useSelector(state => state.address);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Validation patterns
  const validationPatterns = {
    name: /^[a-zA-Z\s]{4,}$/,
    phone: /^[0-9]{10}$/,
    zipCode: /^[0-9]{6}$/,
  };

  // Validation messages
  const validationMessages = {
    name: "Name must be at least 4 characters long",
    phone: "Phone number must be exactly 10 digits",
    zipCode: "Pincode must be exactly 6 digits",
    street: "Street address is required",
    city: "City is required",
    state: "State is required",
  };

  const validateField = (name, value) => {
    if (!value) {
      return validationMessages[name];
    }

    if (validationPatterns[name] && !validationPatterns[name].test(value)) {
      return validationMessages[name];
    }

    return "";
  };

  // Redirect if no cart items
  useEffect(() => {
    if (!cartItems.length) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const [selectedAddress, setSelectedAddress] = useState(addresses.find(addr => addr.isDefault)?._id || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentError, setPaymentError] = useState('');

  // Calculate order totals
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.variant.discountPrice || item.variant.price;
    return acc + price * item.quantity;
  }, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  // const tax = subtotal * 0.18;
  const total = subtotal + shipping;

  // Add this function to fetch available coupons
  const fetchAvailableCoupons = async () => {
    try {
      const response = await getAvailableCoupons();
      setAvailableCoupons(response.data.coupons);
      setShowCoupons(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch coupons",
        variant: "destructive",
      });
    }
  };

  // Add this function to apply coupon
  const handleApplyCoupon = async () => {
    try {
      const response = await validateCoupon({
        code: couponCode,
        totalAmount: orderSummary.subtotal
      });

      setAppliedCoupon(response.data.coupon);
      setDiscountAmount(response.data.discountAmount);
      setCouponError('');
      
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      setCouponError(error.response?.data?.message || "Failed to apply coupon");
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to apply coupon",
        variant: "destructive",
      });
    }
  };

  // Add this function to select coupon from list
  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.couponCode);
    setShowCoupons(false);
  };

  // Add this function to handle coupon removal
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = async (orderId) => {
    try {
      // Create Razorpay order
      const orderDetails = await createRazorpayOrder(orderId);
      
      // Process payment
      await processPayment(
        orderDetails,
        // Success callback
        async (orderId) => {
          await dispatch(clearCart()).unwrap();
          navigate('/order-success', { state: { orderId } });
        },
        // Failure callback
        (orderId) => {
          navigate('/payment-failure', {
            state: {
              orderId,
              retryPayment: () => handlePayment(orderId)
            },
            replace: true
          });
        }
      );
    } catch (error) {
      console.error('Payment failed:', error);
      navigate('/payment-failure', {
        state: {
          orderId,
          retryPayment: () => handlePayment(orderId)
        },
        replace: true
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive"
      });
      return;
    }
    if (!validatePaymentMethod()) {
      toast({
        description: paymentError,
        variant: "destructive",
      });
      return;
    }

    const { isValid, errorMessage } = validateCartItems();
    if (!isValid) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    try {
      if (appliedCoupon) {
        await markCouponAsUsed(appliedCoupon._id);
      }

      // Update stock for each item in the cart
      const stockUpdatePromises = cartItems.map(item =>
        updateProductStockApi(
          item.product._id,
          item.variant._id,
          item.quantity
        )
      );

      try {
        await Promise.all(stockUpdatePromises);
      } catch (error) {
        toast({
          //title: "Error",
          description: "Some items are out of stock",
          variant: "destructive"
        });
        return;
      }

      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          variant: item.variant._id,
          quantity: item.quantity,
          price: item.variant.discountPrice || item.variant.price
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        totalAmount: total - discountAmount
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      if (paymentMethod === 'online') {
        // Handle online payment through Razorpay
        await handlePayment(result.orderId);
      } else {
        // For COD, proceed with order completion
        await dispatch(clearCart()).unwrap();
        
        toast({
          title: "Success",
          description: "Your order has been placed successfully!"
        });

        navigate('/order-success', {
          state: { orderId: result.orderId },
          replace: true
        });
      }
    } catch (error) {
      toast({
       // title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field on change
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'isDefault') {
        errors[key] = validateField(key, formData[key]);
      }
    });

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    const addressData = {
      type: formData.type,
      name: formData.name,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      phone: formData.phone,
      isDefault: formData.isDefault
    };

    try {
      await dispatch(addNewAddress(addressData)).unwrap();
      toast({
        title: "Success",
        description: "Address added successfully",
      });
      resetForm();
      setIsModalOpen(false);
      dispatch(fetchAddresses());
    } catch (error) {
      toast({
        //title: "Error",
        description: error.message || "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const startEdit = (address) => {
    setFormData({
      type: address.type || 'home',
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.pincode,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setEditingId(address._id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    });
    setEditingId(null);
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const addressData = {
      type: formData.type,
      name: formData.name,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      phone: formData.phone,
      isDefault: formData.isDefault
    };

    try {
      await dispatch(updateExistingAddress({ id: editingId, addressData })).unwrap();
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
      resetForm();
      setIsModalOpen(false);
      dispatch(fetchAddresses());
    } catch (error) {
      toast({
       // title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      });
    }
  };


  //validation part
  const validateCartItems = () => {
    let isValid = true;
    let errorMessage = '';

    for (const item of cartItems) {
      // Check product status
      if (item.product.status !== 'active') {
        isValid = false;
        errorMessage = `${item.product.name} is currently unavailable`;
        break;
      }

      // Check category status
      if (item.product.category.status === 'blocked') {
        isValid = false;
        errorMessage = `${item.product.name} is not available in this category`;
        break;
      }

      // Check variant status
      if (item.variant.isBlocked) {
        isValid = false;
        errorMessage = `${item.product.name} (${item.variant.color}) is currently unavailable`;
        break;
      }

      // Check stock
      if (item.variant.stock < item.quantity) {
        isValid = false;
        errorMessage = `${item.product.name} (${item.variant.color}) has insufficient stock. Available: ${item.variant.stock}`;
        break;
      }
    }

    return { isValid, errorMessage };
  };

  // Calculate final total with discount
  const finalTotal = orderSummary.total - discountAmount;

  // paymewnt validate function 

  const validatePaymentMethod = () => {
    if(paymentMethod === 'cod' && total > 1000){
      setPaymentError('Cash on Delivery is not available for orders above ₹1,000. Please choose online payment.');
      return false;
    }
    setPaymentError('');
    return true;
  };

  return (
    <Layout>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout content - Left side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Products Section */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Review your items before placing the order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={item.variant.mainImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium">{item.product.name}</h3>
                        <div className="flex justify-between mt-1">
                          <div className="text-sm text-gray-500">
                            <p>Color: {item.variant.color}</p>
                            <p>Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium">
                            ₹{((item.variant.discountPrice || item.variant.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address Section */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Select a delivery address</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAddress}
                  onValueChange={setSelectedAddress}
                  className="grid gap-4 grid-cols-1 md:grid-cols-2"
                >
                  {addresses.map((address) => (
                    <div key={address._id} className="relative group">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          startEdit(address);
                        }}
                        className="absolute right-2 top-2 rounded p-1.5 hover:bg-gray-100 transition-colors z-10 bg-white shadow-sm"
                        title="Edit address"
                        aria-label={`Edit ${address.type} address`}
                      >
                        <Pencil className="h-4 w-4 text-gray-600 hover:text-primary" />
                      </button>

                      <RadioGroupItem
                        value={address._id}
                        id={`address-${address._id}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`address-${address._id}`}
                        className="flex flex-col p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{address.type}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{address.name}</p>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.pincode}</p>
                          <p className="mt-1">{address.phone}</p>
                        </div>
                        <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                          <Check className="h-5 w-5" />
                        </div>
                      </Label>
                    </div>
                  ))}

                  {/* Add new address option */}
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center p-4 border rounded-lg border-dashed hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="text-center">
                      <span className="text-sm font-medium text-primary">+ Add New Address</span>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you want to pay</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
              <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => {
                    setPaymentMethod(value);
                    setPaymentError('');
                  }}
                  className="grid gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem 
                      value="cod" 
                      id="cod" 
                      className="peer sr-only"
                      disabled={finalTotal > 1000}
                    />
                    <Label
                      htmlFor="cod"
                      className={`flex gap-3 p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50 ${
                        finalTotal > 1000 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <circle cx="12" cy="12" r="2" />
                          <path d="M6 12h.01M18 12h.01" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">
                          {finalTotal > 1000 
                            ? "Not available for orders above ₹1,000"
                            : "Pay when you receive your order"
                          }
                        </p>
                      </div>
                      <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="h-5 w-5" />
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="online" id="online" className="peer sr-only" />
                    <Label
                      htmlFor="online"
                      className="flex gap-3 p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium">Online Payment</span>
                        <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                      </div>
                      <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="h-5 w-5" />
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {paymentError && (
                  <p className="text-sm text-red-500 mt-2">{paymentError}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              {/* Replace the Order Summary section with */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                
                {/* Coupon Section */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border p-2 rounded"
                      disabled={appliedCoupon}
                    />
                    {!appliedCoupon ? (
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Available Coupons Dropdown */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        if (!showCoupons) {
                          fetchAvailableCoupons();
                        } else {
                          setShowCoupons(false);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100"
                      disabled={appliedCoupon}
                    >
                      <span className="text-sm font-medium">Available Coupons</span>
                      {showCoupons ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {showCoupons && (
                      <div className="max-h-60 overflow-y-auto">
                        {availableCoupons.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            No coupons available
                          </div>
                        ) : (
                          availableCoupons.map((coupon) => (
                            <div
                              key={coupon._id}
                              className="p-3 border-t hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSelectCoupon(coupon)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{coupon.couponCode}</span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      {coupon.discountType === 'percentage'
                                        ? `${coupon.discountValue}% off`
                                        : `₹${coupon.discountValue} off`}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Min. order: ₹{coupon.minOrderAmount}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {couponError && (
                    <p className="text-sm text-red-500">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          Coupon applied: {appliedCoupon.couponCode} (-₹{discountAmount.toFixed(2)})
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  {orderSummary.subtotal > 500 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>₹{orderSummary.deliveryCharge.toFixed(2)}</span>
                  )}
                </div>
                {orderSummary.subtotal > 0 && orderSummary.subtotal <= 500 && (
                  <div className="text-sm text-gray-600">
                    Add items worth ₹{(500 - orderSummary.subtotal).toFixed(2)} more for free delivery
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingId ? "Edit Address" : "Add New Address"}
      >
        <form onSubmit={editingId ? handleEditAddress : handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.street ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 focus:border-blue-500 focus:outline-none`}
            />
            {formErrors.street && (
              <p className="mt-1 text-sm text-red-500">{formErrors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.city ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {formErrors.city && (
                <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.state ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {formErrors.state && (
                <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {formErrors.zipCode && (
                <p className="mt-1 text-sm text-red-500">{formErrors.zipCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton type="submit">
              {editingId ? 'Save Changes' : 'Save Address'}
            </CustomButton>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Checkout;
