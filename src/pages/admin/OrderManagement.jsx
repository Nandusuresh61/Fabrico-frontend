import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useOrders } from '../../hooks/useOrders';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';  
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';    
import { 
  Search, 
  X, 
  Filter, 
  ArrowUpDown, 
  ArrowDown, 
  ArrowUp,
  RefreshCcw,
  Eye,
  Loader2
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';

const OrderManagement = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returnToVerify, setReturnToVerify] = useState(null);

  const {
    orders,
    totalOrders,
    loading,
    error,
    updateOrderStatus,
    updateReturnStatus,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    clearFilters,
  } = useOrders();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast({
        title: "Order Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleReturnVerify = async (orderId, itemId, status) => {
    try {
      const success = await updateReturnStatus(orderId, itemId, status);
      if (success) {
        toast({
          title: "Return Request Processed",
          description: status === 'approved' 
            ? "Return approved and refund issued to customer's wallet" 
            : "Return request has been rejected",
        });
        
        // Refresh the orders list to show updated status
        window.location.reload();
      } else {
        throw new Error("Failed to process return request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process return request",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderOrderStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      "out for delivery": "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderReturnStatusBadge = (status) => {
    if (!status) return null;
    
    const statusColors = {
      requested: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading orders: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

console.log(orders)
  
  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-gray-500">Manage customer orders, update status, and process returns</p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline" 
              onClick={() => handleSort('createdAt')}
              className="px-3"
            >
              Date {getSortIcon('createdAt')}
            </Button>
            
            <Button
              variant="outline" 
              onClick={() => handleSort('totalAmount')}
              className="px-3"
            >
              Total {getSortIcon('totalAmount')}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={clearFilters} 
              className="px-3"
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        {/* Orders table */}
        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-xl">Orders</CardTitle>
            <CardDescription>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading orders...
                </div>
              ) : (
                `Showing ${orders.length} of ${totalOrders} orders`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Loading orders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.user.username}</span>
                          <span className="text-sm text-gray-500">{order.user.email}</span>
                          {order.items.some(item => item.returnRequest?.status === 'requested') && (
                            <span className="text-xs text-yellow-600 mt-1">
                              Return Request Obtained
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{renderOrderStatusBadge(order.status)}</TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
                              {selectedOrder && (
                                <>
                                  {console.log('Selected Order Details:', selectedOrder)}
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-4">
                                      <span>Order Details - {selectedOrder.orderId}</span>
                                      <span>{renderOrderStatusBadge(selectedOrder.status)}</span>
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500">
                                      Placed on {formatDate(selectedOrder.createdAt)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                                      <h3 className="font-semibold text-red-800 mb-2">Cancellation Reason</h3>
                                      <p className="text-red-700">{selectedOrder.cancellationReason}</p>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Customer Information</h3>
                                      <p>{selectedOrder.user.username}</p>
                                      <p>{selectedOrder.user.email}</p>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                                      {selectedOrder.shippingAddress.addressLine2 && (
                                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                                      )}
                                      <p>
                                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}  {selectedOrder.shippingAddress.pincode}
                                      </p>
                                      <p>{selectedOrder.shippingAddress.phone}</p>
                                      <p>{selectedOrder.shippingAddress.state}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="border rounded-md overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                          {selectedOrder.status !== 'cancelled' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Status</th>
                                          )}
                                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedOrder.items.map((item) => (
                                          <tr key={item._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                              <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                  <img 
                                                    className="h-10 w-10 rounded-md object-cover" 
                                                    src={item.variant?.mainImage || '/placeholder-image.jpg'} 
                                                    alt={item.product?.name} 
                                                  />
                                                </div>
                                                <div className="ml-4">
                                                  <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                                                  <div className="text-sm text-gray-500 space-y-0.5">
                                                    {item.product?.brand?.name && <div>Brand: {item.product.brand.name}</div>}
                                                    {item.product?.category?.name && <div>Category: {item.product.category.name}</div>}
                                                    {item.variant?.name && <div>Variant: {item.variant.name}</div>}
                                                    {item.variant?.color && <div>Color: {item.variant.color}</div>}
                                                    {item.variant?.size && <div>Size: {item.variant.size}</div>}
                                                  </div>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                                            {selectedOrder.status !== 'cancelled' && (
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                {item.returnRequest && item.returnRequest.status !== 'none' ? (
                                                  <div className="flex flex-col gap-1">
                                                    <Badge variant="outline">Return Requested</Badge>
                                                    {renderReturnStatusBadge(item.returnRequest.status)}
                                                    {item.returnRequest.reason && (
                                                      <span className="text-xs text-gray-500">Reason: {item.returnRequest.reason}</span>
                                                    )}
                                                    {item.returnRequest.status === 'requested' && (
                                                      <div className="flex gap-2 mt-2">
                                                        <Button
                                                          variant="outline"
                                                          size="sm"
                                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                          onClick={() => handleReturnVerify(selectedOrder._id, item._id, 'rejected')}
                                                        >
                                                          Reject Return
                                                        </Button>
                                                        <Button
                                                          variant="outline"
                                                          size="sm"
                                                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                          onClick={() => handleReturnVerify(selectedOrder._id, item._id, 'approved')}
                                                        >
                                                          Approve Return
                                                        </Button>
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : 'No request'}
                                              </td>
                                            )}
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                              {selectedOrder.status !== 'cancelled' && item.returnRequest && item.returnRequest.status === 'requested' && (
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleReturnVerify(selectedOrder._id, item._id)}
                                                >
                                                  Verify Return
                                                </Button>
                                              )}
                                            </td> */}
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot className="bg-gray-50">
                                        <tr>
                                          <td colSpan={2} className="px-6 py-3 text-right text-sm font-medium text-gray-500">Total:</td>
                                          <td colSpan={3} className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                                            ₹{selectedOrder.totalAmount.toFixed(2)}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                  
                                  <DialogFooter className="flex justify-between items-center mt-6 gap-4">
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-500 mb-2">Update Order Status</div>
                                      <Select 
                                        value={selectedOrder.status} 
                                        onValueChange={(value) => handleOrderStatusChange(selectedOrder._id, value)}
                                        disabled={selectedOrder.status === 'cancelled'}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="shipped">Shipped</SelectItem>
                                          <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                                          <SelectItem value="delivered">Delivered</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                            
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => handleOrderStatusChange(order._id, value)}
                            disabled={order.status === 'cancelled'}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No orders found matching the filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-gray-500">
              Showing page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <PaginationItem>
                          <span className="px-4 py-2">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>

        {/* Return verification dialog */}
        <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Return Request</DialogTitle>
              <DialogDescription>
                Approve or reject this return request. If approved, the refund amount will be credited to the customer's wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => processReturn('rejected')}>
                Reject Return
              </Button>
              <Button onClick={() => processReturn('approved')}>
                Approve & Refund
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderManagement;
