import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getOrders, 
  updateOrderStatus as updateOrderStatusAction,
  verifyReturnRequest,
  setFilters,
  resetFilters as resetFiltersAction,
  setCurrentPage as setCurrentPageAction
} from '../redux/features/orderSlice';

export const useOrders = () => {
  const dispatch = useDispatch();
  const { 
    orders,
    loading,
    error,
    pagination: { currentPage, totalPages, totalOrders },
    filters: { search, status, sortBy, sortOrder }
  } = useSelector(state => state.order);

  useEffect(() => {
    // Fetch orders when filters or pagination changes
    dispatch(getOrders({ 
      page: currentPage, 
      search, 
      status, 
      sortBy, 
      sortOrder 
    }));
  }, [dispatch, currentPage, search, status, sortBy, sortOrder]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatusAction({ id: orderId, status: newStatus })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateReturnStatus = async (orderId, itemId, status) => {
    try {
      await dispatch(verifyReturnRequest({ orderId, itemId, status })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const setSearchTerm = (term) => {
    dispatch(setFilters({ search: term }));
    dispatch(setCurrentPageAction(1)); // Reset to first page on search
  };

  const setStatusFilter = (newStatus) => {
    dispatch(setFilters({ status: newStatus }));
    dispatch(setCurrentPageAction(1)); // Reset to first page on filter change
  };

  const setSortBy = (field) => {
    dispatch(setFilters({ sortBy: field }));
  };

  const setSortOrder = (order) => {
    dispatch(setFilters({ sortOrder: order }));
  };

  const setCurrentPage = (page) => {
    dispatch(setCurrentPageAction(page));
  };

  const clearFilters = () => {
    dispatch(resetFiltersAction());
    dispatch(setCurrentPageAction(1));
  };

  return {
    orders,
    totalOrders,
    loading,
    error,
    updateOrderStatus,
    updateReturnStatus,
    searchTerm: search,
    setSearchTerm,
    statusFilter: status,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    clearFilters,
  };
};
