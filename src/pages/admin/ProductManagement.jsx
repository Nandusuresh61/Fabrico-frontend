
import { useState } from 'react';
import { Search, Edit, Trash2, Plus, Filter } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import CustomButton from '../../components/ui/CustomButton';

// Mock product data
const products = [
  { id: 1, name: 'Vintage Baseball Cap', category: 'Baseball Caps', brand: 'CapCraft', price: 39.99, stock: 25, status: 'Active' },
  { id: 2, name: 'Classic Snapback', category: 'Snapbacks', brand: 'UrbanLid', price: 45.99, stock: 18, status: 'Active' },
  { id: 3, name: 'Premium Trucker Cap', category: 'Trucker Caps', brand: 'HeadStyle', price: 49.99, stock: 12, status: 'Active' },
  { id: 4, name: 'Urban Fitted Cap', category: 'Fitted Caps', brand: 'StreetCrown', price: 55.99, stock: 8, status: 'Active' },
  { id: 5, name: 'Minimalist Dad Hat', category: 'Dad Hats', brand: 'CapCraft', price: 35.99, stock: 30, status: 'Active' },
  { id: 6, name: 'Sport Performance Cap', category: 'Baseball Caps', brand: 'HeadStyle', price: 42.99, stock: 15, status: 'Inactive' },
  { id: 7, name: 'Limited Edition Cap', category: 'Snapbacks', brand: 'UrbanLid', price: 59.99, stock: 5, status: 'Active' },
  { id: 8, name: 'Designer Collaboration Cap', category: 'Fitted Caps', brand: 'StreetCrown', price: 65.99, stock: 10, status: 'Active' },
];

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Get unique categories and brands for filter dropdowns
  const categories = ['All', ...new Set(products.map((product) => product.category))];
  const brands = ['All', ...new Set(products.map((product) => product.brand))];

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <CustomButton icon={<Plus className="h-4 w-4" />} iconPosition="left">
            Add New Product
          </CustomButton>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category} Categories</option>
            ))}
          </select>
          
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand} Brands</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
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
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{product.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {product.brand}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    ${product.price}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {product.stock}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">8</span> products
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-sm disabled:opacity-50">
              &lt;
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm text-white">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-sm disabled:opacity-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;
