import { useState } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import CustomButton from '../../components/ui/CustomButton';
import AddProductForm from '../admin/Product/AddProductForm';

// Mock product data
const initialProducts = [
  { id: 1, name: 'Vintage Baseball Cap', category: 'Baseball Caps', brand: 'CapCraft', price: 39.99, stock: 25, status: 'Active' },
  { id: 2, name: 'Classic Snapback', category: 'Snapbacks', brand: 'UrbanLid', price: 45.99, stock: 18, status: 'Active' },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle open/close modal
  const handleAddProduct = () => setIsModalOpen(!isModalOpen);

  // Handle adding a new product
  const handleAddProductSubmit = (newProduct) => {
    const newId = products.length + 1;
    const productWithId = { ...newProduct, id: newId };

    // Add product to state
    setProducts([...products, productWithId]);

    // Close modal after adding product
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <CustomButton
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
            onClick={handleAddProduct}
          >
            Add New Product
          </CustomButton>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">ID</th>
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
  {filteredProducts.map((product) => (
    <tr key={product.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">{product.id}</td>
      <td className="px-6 py-4 flex items-center gap-2">
        {product.images && product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-10 w-10 rounded object-cover"
          />
        )}
        {product.name}
      </td>
      <td className="px-6 py-4">{product.category}</td>
      <td className="px-6 py-4">{product.brand}</td>
      <td className="px-6 py-4">${product.price}</td>
      <td className="px-6 py-4">{product.stock}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs ${
            product.status === 'Active'
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
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <AddProductForm
          onClose={handleAddProduct}
          onSubmit={handleAddProductSubmit}
        />
      )}
    </>
  );
};

export default ProductManagement;
