import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Eye, XCircle, AlertTriangle, Package, Truck, CheckCircle, CreditCard, Receipt } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import { getUserOrders, cancelOrderForUser } from '../../../redux/features/orderSlice';
import Loader from '../../../components/layout/Loader';

const Orders = () => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const { orders, loading, error, pagination } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getUserOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleOrderSelect = (order) => {
    console.log('Selected Order:', order);
    setSelectedOrder(order);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) return;
    
    const reason = cancelReason === 'other' ? otherReason : cancelReason;
    await dispatch(cancelOrderForUser({ 
      id: selectedOrder._id, 
      data: { reason } 
    }));
    setShowCancelModal(false);
    setCancelReason('');
    setOtherReason('');
  };

  const cancelReasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Found better price elsewhere',
    'Delivery time too long',
    'Payment issues',
    'Other'
  ];

  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Orders</h2>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Date', 'Status', 'Total', 'Items', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order.orderId} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatCurrency(order.totalAmount)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.items.length}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleOrderSelect(order)} className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                      <Eye className="h-4 w-4" /> <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No Orders Found</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet</p>
          <CustomButton className="mt-4" variant="outline">Browse Products</CustomButton>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1 shadow-lg ring-1 ring-gray-200 transition-transform hover:scale-110"
            >
              <XCircle className="h-6 w-6 text-gray-400" />
            </button>

            {/* Header - Fixed */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-6 flex-shrink-0">
              <div className="absolute inset-0 bg-grid-primary/5" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Order #{selectedOrder.orderId}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Placed on {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)} {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <div className="grid gap-8 p-8 lg:grid-cols-3">
                {/* Order Items Section */}
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-6 py-4">
                      <h4 className="text-lg font-medium text-gray-900">Order Items</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-6 p-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                            <img
                              src={item.variant?.mainImage || item.product.mainImage}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <div>
                                <h5 className="text-base font-medium text-gray-900">{item.product.name}</h5>
                                {item.variant && (
                                  <p className="mt-1 text-sm text-gray-600">Variant: {item.variant.name}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-600">Qty: {item.quantity}</p>
                                {selectedOrder.status === 'delivered' && (
                                  <button
                                    onClick={() => {
                                      // Handle return product
                                    }}
                                    className="mt-2 inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                  >
                                    Return Item
                                  </button>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-base font-medium text-gray-900">{formatCurrency(item.price)}</p>
                                <p className="mt-1 text-sm text-gray-600">
                                  Subtotal: {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Details Section */}
                <div className="space-y-6 lg:col-span-1">
                  {/* Shipping Address */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h4 className="flex items-center gap-2 font-medium text-gray-900">
                        <Truck className="h-5 w-5 text-gray-400" />
                        Shipping Address
                      </h4>
                    </div>
                    <div className="p-6">
                      {selectedOrder.shippingAddress ? (
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                          <p className="text-gray-600">{selectedOrder.shippingAddress.street}</p>
                          <p className="text-gray-600">
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                          </p>
                          <p className="mt-3 text-gray-600">
                            <span className="font-medium text-gray-900">Phone:</span> {selectedOrder.shippingAddress.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="capitalize">{selectedOrder.shippingAddress.type}</span> Address
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No shipping address available</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h4 className="flex items-center gap-2 font-medium text-gray-900">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        Payment Details
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Payment Status</span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${selectedOrder.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h4 className="flex items-center gap-2 font-medium text-gray-900">
                        <Receipt className="h-5 w-5 text-gray-400" />
                        Order Summary
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatCurrency(selectedOrder.totalAmount - (selectedOrder.shippingCost || 0) - (selectedOrder.tax || 0))}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>{formatCurrency(selectedOrder.shippingCost || 0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span>{formatCurrency(selectedOrder.tax || 0)}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(selectedOrder.discount)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between">
                            <span className="text-base font-medium text-gray-900">Total (Inc. Tax)</span>
                            <span className="text-base font-medium text-gray-900">
                              {formatCurrency(selectedOrder.totalAmount)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            *Tax rate may vary based on your location and applicable laws
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 rounded-b-2xl flex-shrink-0">
              <div className="flex gap-3">
                <CustomButton
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </CustomButton>
                {selectedOrder.status === 'pending' && (
                  <CustomButton
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Order
                  </CustomButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
            {/* Close button */}
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1 shadow-lg ring-1 ring-gray-200 transition-transform hover:scale-110"
            >
              <XCircle className="h-6 w-6 text-gray-400" />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Cancel Order</h3>
              <p className="mt-2 text-sm text-gray-600">
                Please select a reason for canceling your order
              </p>

              <div className="mt-4">
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a reason</option>
                  {cancelReasons.map((reason) => (
                    <option key={reason} value={reason.toLowerCase()}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {cancelReason === 'other' && (
                <div className="mt-4">
                  <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Please specify your reason..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                  />
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <CustomButton
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Order
                </CustomButton>
                <CustomButton
                  className="w-full"
                  onClick={handleCancelOrder}
                  disabled={!cancelReason || (cancelReason === 'other' && !otherReason)}
                >
                  Cancel Order
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
