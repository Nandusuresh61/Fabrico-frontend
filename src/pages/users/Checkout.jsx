import { useState, useEffect } from 'react';
import { Check, CreditCard, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/features/cartSlice';

// Mock data for cart items in checkout
const cartItems = [
  {
    id: '1',
    name: 'Premium Fitted Cap',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    price: 29.99,
    quantity: 1,
  },
  {
    id: '2',
    name: 'Vintage Snapback',
    imageUrl: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    price: 24.99,
    quantity: 2,
  }
];

// Mock data for saved addresses
const savedAddresses = [
  {
    id: '1',
    name: 'Home',
    recipient: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '(555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Work',
    recipient: 'John Doe',
    street: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'United States',
    phone: '(555) 987-6543',
    isDefault: false,
  }
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, orderSummary } = location.state || { cartItems: [], orderSummary: {} };

  // Redirect if no cart items
  useEffect(() => {
    if (!cartItems.length) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [selectedAddress, setSelectedAddress] = useState(savedAddresses.find(addr => addr.isDefault)?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  
  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    try {
      // Clear the cart
      await dispatch(clearCart()).unwrap();
      
      toast.success('Your order has been placed successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
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
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="relative">
                      <RadioGroupItem 
                        value={address.id} 
                        id={`address-${address.id}`} 
                        className="peer sr-only"
                      />
                      <Label 
                        htmlFor={`address-${address.id}`}
                        className="flex flex-col p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{address.name}</span>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{address.recipient}</p>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                          <p className="mt-1">{address.phone}</p>
                        </div>
                        <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                          <Check className="h-5 w-5" />
                        </div>
                      </Label>
                    </div>
                  ))}
                  
                  {/* Add new address option */}
                  <div className="flex items-center justify-center p-4 border rounded-lg border-dashed hover:bg-gray-50 cursor-pointer">
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
                  onValueChange={setPaymentMethod}
                  className="grid gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="credit-card" id="credit-card" className="peer sr-only" />
                    <Label 
                      htmlFor="credit-card"
                      className="flex gap-3 p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium">Credit / Debit Card</span>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                      <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="h-5 w-5" />
                      </div>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                    <Label 
                      htmlFor="paypal"
                      className="flex gap-3 p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.0112 6.24863C19.0112 8.07253 18.0972 9.41199 16.3258 10.5992C16.9345 13.8478 14.9131 15.7818 11.8592 15.7818H11.1531C10.8506 15.7818 10.6456 16.0343 10.5431 16.3343L10.3381 17.2983L9.67195 21.1416C9.62045 21.3941 9.41546 21.5991 9.113 21.5991H6.21166C5.96042 21.5991 5.8092 21.4417 5.8092 21.2367C5.85795 21.1416 5.8592 21.0953 5.8592 21.0953L7.10018 14.1929C7.10018 14.0342 7.2514 13.8292 7.50264 13.8292H8.21025C9.57045 13.8292 10.7229 13.5754 11.6344 12.9729C12.6459 12.3704 13.2534 11.4054 13.5084 10.0329H11.0531C10.8018 10.0329 10.598 9.92793 10.598 9.57671V6.24863C10.598 5.94741 10.8018 5.70243 11.0531 5.70243H11.7591H14.5131H17.3232H18.4538C18.7563 5.70243 18.9612 5.94741 19.0112 6.24863Z" fill="#253B80"/>
                          <path d="M8.73259 1.89953H15.595C17.4264 1.89953 18.7891 2.15077 19.5467 3.01323C20.2017 3.76947 20.393 4.93094 20.2442 6.24915C19.9417 9.51023 18.0564 11.4442 15.0588 11.4442H12.3994C12.0969 11.4442 11.8919 11.7442 11.7894 11.9967L11.171 15.7366C11.171 15.9416 10.966 16.1942 10.7611 16.1942H7.70706C7.45582 16.1942 7.40707 16.0367 7.40707 15.8793V15.6743L8.78134 3.24571C8.78134 2.99447 8.98382 1.89953 9.74006 1.89953H8.73259Z" fill="#179BD7"/>
                          <path d="M9.78882 6.24863C9.83757 5.99739 10.0425 5.70243 10.2938 5.70243H18.3938C18.6938 5.70243 18.8988 5.94741 18.9488 6.24863C18.9488 8.07253 18.0348 9.41199 16.2634 10.5992C16.8721 13.8478 14.8507 15.7818 11.7968 15.7818H11.0908C10.7883 15.7818 10.5833 16.0343 10.4808 16.3343L10.2758 17.2983L9.60962 21.1416C9.55811 21.3941 9.35313 21.5991 9.05066 21.5991H6.14933C5.89809 21.5991 5.74687 21.4417 5.74687 21.2367C5.79562 21.1416 5.79687 21.0953 5.79687 21.0953L7.03785 14.1929C7.03785 14.0342 7.18907 13.8292 7.44031 13.8292H8.14792C9.50811 13.8292 10.6606 13.5754 11.5721 12.9729C12.5836 12.3704 13.1911 11.4054 13.4461 10.0329H10.9908C10.7395 10.0329 10.5357 9.92793 10.5357 9.57671V6.24863H9.78882Z" fill="#222D65"/>
                          <path d="M9.69744 5.70243H17.2756C17.5781 5.70243 17.8293 5.99739 17.7806 6.24863C17.5756 9.51023 15.6903 11.4442 12.6928 11.4442H10.0334C9.73091 11.4442 9.52592 11.7442 9.42342 11.9967L8.80506 15.7366C8.80506 15.9416 8.60007 16.1942 8.39509 16.1942H5.34106C5.08982 16.1942 4.94235 16.0367 5.04111 15.8793L6.46506 3.24571C6.46506 2.99447 6.66754 1.89953 7.42378 1.89953H14.0371C15.8684 1.89953 17.2286 2.15077 17.9862 3.01323C18.5949 3.76947 18.8436 4.93094 18.6386 6.24915L17.7806 6.24863H9.69744Z" fill="#253B80"/>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">PayPal</span>
                        <p className="text-sm text-gray-500">Pay easily with your PayPal account</p>
                      </div>
                      <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="h-5 w-5" />
                      </div>
                    </Label>
                  </div>
                  
                  {/* Credit Card Form - only shown when credit card is selected */}
                  {paymentMethod === 'credit-card' && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <Label htmlFor="card-name">Cardholder Name</Label>
                            <Input 
                              id="card-name" 
                              placeholder="Name on card" 
                              className="mt-1" 
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input 
                              id="card-number" 
                              placeholder="1234 5678 9012 3456" 
                              className="mt-1" 
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input 
                              id="expiry-date" 
                              placeholder="MM/YY" 
                              className="mt-1" 
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              placeholder="123" 
                              className="mt-1" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary - Right side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{orderSummary.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>₹{orderSummary.tax?.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{orderSummary.total?.toFixed(2)}</span>
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
    </Layout>
  );
};

export default Checkout;
