import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { getAllProducts, editProduct, toggleProductStatus, toggleProductMainStatus, editProductName } from '../../redux/features/productSlice';
import CustomButton from '../../components/ui/CustomButton';
import AddProductForm from './Product/AddProductForm';
import EditProductForm from './Product/EditProductForm';
import EditProductNameForm from './Product/EditProductNameForm';
import { useToast } from "../../hooks/use-toast";
import React from 'react';

const ProductManagement = () => {
  let count = 1;
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, total, page, totalPages, loading } = useSelector((state) => state.product);

  // States for search, sort, and filter
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortField') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  
  // Other states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState({});
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [selectedProductForName, setSelectedProductForName] = useState(null);

  const updateUrlAndFetch = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...newParams };
    
    Object.keys(updatedParams).forEach(key => 
      !updatedParams[key] && delete updatedParams[key]
    );

    setSearchParams(updatedParams);
    dispatch(getAllProducts(updatedParams));
  };

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      limit: 10,
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      sortField: searchParams.get('sortField') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };
    dispatch(getAllProducts(params));
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      updateUrlAndFetch({ page: newPage });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateUrlAndFetch({ search: searchTerm, page: 1 });
  };

  const handleSort = (field) => {
    const newSortOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
    updateUrlAndFetch({ sortField: field, sortOrder: newSortOrder, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    updateUrlAndFetch({ status, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateUrlAndFetch({ search: '', page: 1 });
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      setLoadingProducts(prev => ({ ...prev, [productId]: true }));
      await dispatch(toggleProductMainStatus(productId)).unwrap();
      toast({
        title: "Product Status Updated Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: error || "There is some error!",
      });
    } finally {
      setLoadingProducts(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddProduct = () => setIsModalOpen(!isModalOpen);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const toggleProductExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleEditVariant = (product, variant) => {
    setSelectedProduct({ ...product, variant });
    setIsEditModalOpen(true);
  };

  const handleEditVariantSubmit = async (data) => {
    try {
      await dispatch(editProduct({ 
        productId: selectedProduct._id, 
        variantId: selectedProduct.variant._id,
        data 
      }));
      setIsEditModalOpen(false);
      toast({
        title: "Variant Update Successful",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error || "There is some error!",
      });
    }
  };

  const handleToggleVariantStatus = async (productId, variantId) => {
    try {
      await dispatch(toggleProductStatus({ productId, variantId }));
      toast({
        title: "Variant Status Updated Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: error || "There is some error!",
      });
    }
  };

  const handleEditProductName = (product) => {
    setSelectedProductForName(product);
    setIsEditNameModalOpen(true);
  };

  const handleEditProductNameSubmit = async (data) => {
    try {
      await dispatch(editProductName({ 
        productId: selectedProductForName._id, 
        data 
      })).unwrap();
      setIsEditNameModalOpen(false);
      toast({
        title: "Product Name Updated Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error || "There was an error updating the product name",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <CustomButton
          icon={<Plus className="h-4 w-4" />}
          onClick={handleAddProduct}
        >
          Add New Product
        </CustomButton>
      </div>

      <div className="mb-6 flex gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <CustomButton type="submit">
            <Search className="h-4 w-4" />
          </CustomButton>
        </form>

        <select
          value={selectedStatus}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-md border px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {products?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Brand</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <React.Fragment key={`product-${product._id}`}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">{count++}</td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => toggleProductExpand(product._id)}>{product.name}</td>
                      <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4">{product.brand?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs ${
                            product.status === 'blocked'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {product.status === 'blocked' ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditProductName(product)}
                          >
                            Edit 
                          </button>
                          <button
                            className={`text-sm font-medium ${
                              product.status === 'blocked' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                            }`}
                            onClick={() => handleToggleProductStatus(product._id)}
                          >
                            {product.status === 'blocked' ? 'Activate' : 'Block'}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => toggleProductExpand(product._id)}>
                        {expandedProducts[product._id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </td>
                    </tr>
                    {expandedProducts[product._id] && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-100 text-xs font-medium uppercase text-gray-500">
                                  <th className="px-4 py-2">Image</th>
                                  <th className="px-4 py-2">Product Name</th>
                                  <th className="px-4 py-2">Category</th>
                                  <th className="px-4 py-2">Brand</th>
                                  <th className="px-4 py-2">Price</th>
                                  <th className="px-4 py-2">Color</th>
                                  <th className="px-4 py-2">Quantity</th>
                                  <th className="px-4 py-2">Status</th>
                                  <th className="px-4 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants?.map((variant) => (
                                  <tr key={`variant-${variant._id}`} className="bg-white">
                                    <td className="px-4 py-2">
                                      {variant.mainImage ? (
                                        <img 
                                          src={variant.mainImage} 
                                          alt={`${product.name} - ${variant.color}`}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                          <span className="text-gray-400 text-xs">No image</span>
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{product.category?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">{product.brand?.name || 'N/A'}</td>
                                    <td className="px-4 py-2">₹{variant.price}</td>
                                    <td className="px-4 py-2">{variant.color}</td>
                                    <td className="px-4 py-2">{variant.stock}</td>
                                    <td className="px-4 py-2">
                                      <span
                                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                                          variant.isBlocked
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}
                                      >
                                        {variant.isBlocked ? 'Blocked' : 'Active'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                      <button
                                        onClick={() => handleEditVariant(product, variant)}
                                        className="text-gray-500 hover:text-primary"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className={`text-gray-500 ${
                                          variant.isBlocked ? 'hover:text-green-500' : 'hover:text-red-500'
                                        }`}
                                        onClick={() => handleToggleVariantStatus(product._id, variant._id)}
                                      >
                                        {variant.isBlocked ? 'Activate' : 'Block'}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {products.length} of {total} results
            </div>
            <div className="flex items-center gap-2">
              <CustomButton
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </CustomButton>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <CustomButton
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </CustomButton>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <AddProductForm
          onClose={handleAddProduct}
        />
      )}
      {isEditModalOpen && (
        <EditProductForm
          product={selectedProduct}
          onSubmit={handleEditVariantSubmit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isEditNameModalOpen && (
        <EditProductNameForm
          product={selectedProductForName}
          onSubmit={handleEditProductNameSubmit}
          onClose={() => setIsEditNameModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;
