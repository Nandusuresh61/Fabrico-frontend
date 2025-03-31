import { useState, useEffect } from 'react';
import { Check, CreditCard, MapPin, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cartSlice';
import { fetchAddresses, addNewAddress, updateExistingAddress } from '../../redux/features/addressSlice';
import Modal from '../../components/ui/Modal';
import CustomButton from '../../components/ui/CustomButton';
import { Home, Briefcase } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

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

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, orderSummary } = location.state || { cartItems: [], orderSummary: {} };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
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
        title: "Error",
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
        title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      });
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
                  {addresses.map((address) => (
                    <div key={address._id} className="relative">
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
                          <span className="font-medium">{address.type}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                startEdit(address);
                              }}
                              className="rounded p-1 hover:bg-gray-100"
                            >
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </button>
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
                  onValueChange={setPaymentMethod}
                  className="grid gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                    <Label 
                      htmlFor="cod"
                      className="flex gap-3 p-4 border rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2"/>
                          <circle cx="12" cy="12" r="2"/>
                          <path d="M6 12h.01M18 12h.01"/>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                      <div className="absolute right-4 top-4 text-primary opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="h-5 w-5" />
                      </div>
                    </Label>
                  </div>
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
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
