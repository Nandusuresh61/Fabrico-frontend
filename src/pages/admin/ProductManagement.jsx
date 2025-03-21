import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { getAllProducts, editProduct, toggleProductStatus, toggleProductMainStatus } from '../../redux/features/productSlice';
import CustomButton from '../../components/ui/CustomButton';
import AddProductForm from './Product/AddProductForm';
import EditProductForm from './Product/EditProductForm';
import { useToast } from "../../hooks/use-toast";
import React from 'react';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { products, totalProducts, currentPage, totalPages, loading } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  let count = 1;

  useEffect(() => {
    dispatch(getAllProducts({ search: searchTerm, page }));
  }, [dispatch, searchTerm, page]);

  const handleAddProduct = () => setIsModalOpen(!isModalOpen);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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

  const handleToggleProductStatus = async (productId) => {
    try {
      await dispatch(toggleProductMainStatus(productId));
      toast({
        title: "Product Status Updated Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: error || "There is some error!",
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

      <div className="mb-6 flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-2 text-gray-500"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <CustomButton onClick={() => dispatch(getAllProducts({ search: searchTerm, page }))}>
          <Search className="h-4 w-4" />
        </CustomButton>
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
                        <button
                          className={`text-sm font-medium ${
                            product.status === 'blocked' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                          }`}
                          onClick={() => handleToggleProductStatus(product._id)}
                        >
                          {product.status === 'blocked' ? 'Activate' : 'Block'}
                        </button>
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

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <CustomButton 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
              >
                Prev
              </CustomButton>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <CustomButton 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
              >
                Next
              </CustomButton>
            </div>
          )}
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
    </div>
  );
};

export default ProductManagement;
