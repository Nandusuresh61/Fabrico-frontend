import { useState } from 'react';
import { ShoppingBag, Eye, XCircle, AlertTriangle, Package, Truck, CheckCircle } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const orders = [
    { id: 'ORD-12345', date: '2023-05-15', status: 'delivered', total: 89.95, items: 2 },
    { id: 'ORD-12346', date: '2023-06-20', status: 'shipped', total: 145.50, items: 3 },
    { id: 'ORD-12347', date: '2023-07-05', status: 'processing', total: 65.75, items: 1 },
    { id: 'ORD-12348', date: '2023-07-28', status: 'cancelled', total: 120.25, items: 2 },
  ];

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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

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
                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatCurrency(order.total)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.items}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Order Details: {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="rounded-full p-1 hover:bg-gray-100">
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="mb-4">
              {['Order Date', 'Status', 'Total', 'Items'].map((label, index) => (
                <div key={index} className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-medium">{label}:</span>
                  <span>{
                    label === 'Order Date' ? formatDate(selectedOrder.date) :
                    label === 'Status' ? getStatusText(selectedOrder.status) :
                    label === 'Total' ? formatCurrency(selectedOrder.total) :
                    selectedOrder.items
                  }</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <CustomButton variant="outline" onClick={() => setSelectedOrder(null)}>Close</CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
