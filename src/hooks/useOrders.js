import { useState } from 'react';

// Mock data for demonstration purposes
const mockOrders = Array.from({ length: 30 }, (_, i) => ({
  id: `ORD-${100000 + i}`,
  userId: `USR-${200000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@example.com`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  status: ['pending', 'shipped', 'out for delivery', 'delivered', 'canceled'][Math.floor(Math.random() * 5)],
  items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
    id: `ITEM-${300000 + i * 3 + j}`,
    productId: `PROD-${400000 + j}`,
    productName: `Product ${j + 1}`,
    productImage: `/placeholder.svg`,
    quantity: Math.floor(Math.random() * 3) + 1,
    price: Math.floor(Math.random() * 100) + 10,
    returnRequested: Math.random() > 0.8,
    returnReason: Math.random() > 0.8 ? 'Defective product' : undefined,
    returnStatus: Math.random() > 0.8 ? 'pending' : undefined,
  })),
  shippingAddress: {
    addressLine1: `${1000 + i} Main St`,
    addressLine2: Math.random() > 0.5 ? 'Apt 101' : undefined,
    city: 'Anytown',
    state: 'CA',
    postalCode: '90001',
    country: 'USA',
  },
  paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
  subtotal: 0, // Will be calculated
  tax: 0, // Will be calculated
  total: 0, // Will be calculated
})).map(order => {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return {
    ...order,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
});

export const useOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    return true;
  };

  const updateReturnStatus = (orderId, itemId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, returnStatus: newStatus } : item
        );
        return { ...order, items: updatedItems };
      }
      return order;
    }));
    return true;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortOrder('desc');
    setSortBy('date');
    setCurrentPage(1);
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const searchMatch = searchTerm === '' || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === 'asc' 
          ? a.total - b.total
          : b.total - a.total;
      }
    });

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return {
    orders: currentItems,
    totalOrders: filteredOrders.length,
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
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    clearFilters,
  };
};
