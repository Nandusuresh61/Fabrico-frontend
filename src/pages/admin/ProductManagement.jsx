import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Edit, Trash2, Plus, X } from 'lucide-react';
import { getAllProducts } from '../../redux/features/productSlice';
import CustomButton from '../../components/ui/CustomButton';
import AddProductForm from '../admin/Product/AddProductForm';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, totalProducts, currentPage, totalPages, loading } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

      {/* ✅ Product Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <th className="px-6 py-3">Preview</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Brand</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
  {products?.map((product) => (
    <tr key={product._id} className="hover:bg-gray-50">
      {/* ✅ Display product image */}
      <td className="px-6 py-4">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="h-10 w-10 flex items-center justify-center rounded bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
      </td>
      <td className="px-6 py-4">{product.name}</td>
      <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
      <td className="px-6 py-4">{product.brand?.name || 'N/A'}</td>
      <td className="px-6 py-4">₹ {product.price}</td>
      <td className="px-6 py-4">{product.stock}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs ${
            product.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 flex gap-2">
        <button className="text-gray-500 hover:text-primary">
          <Edit className="h-4 w-4" />
        </button>
        <button className="text-gray-500 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  ))}
</tbody>


        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <CustomButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Prev
        </CustomButton>
        <span>{page} of {totalPages}</span>
        <CustomButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </CustomButton>
      </div>

      {/* ✅ Add Product Modal */}
      {isModalOpen && (
        <AddProductForm
          onClose={handleAddProduct}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
};

export default ProductManagement;
