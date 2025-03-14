import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

import CustomButton from '../../components/ui/CustomButton';

// Mock category data
const categories = [
  { id: 1, name: 'Baseball Caps', products: 25, createdAt: '2023-05-01' },
  { id: 2, name: 'Snapbacks', products: 18, createdAt: '2023-05-05' },
  { id: 3, name: 'Trucker Caps', products: 12, createdAt: '2023-05-10' },
  { id: 4, name: 'Fitted Caps', products: 20, createdAt: '2023-05-15' },
  { id: 5, name: 'Dad Hats', products: 15, createdAt: '2023-05-20' },
  { id: 6, name: 'Beanies', products: 10, createdAt: '2023-06-01' },
  { id: 7, name: 'Bucket Hats', products: 8, createdAt: '2023-06-10' },
  { id: 8, name: 'Visors', products: 5, createdAt: '2023-06-15' },
];

const CategoryManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    // Add category logic
    setIsAddModalOpen(false);
    setNewCategoryName('');
  };

  const handleEditCategory = () => {
    // Edit category logic
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Category Management</h1>
          <CustomButton 
            icon={<Plus className="h-4 w-4" />} 
            iconPosition="left"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Category
          </CustomButton>
        </div>
        
        {/* Categories Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{category.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {category.products}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {category.createdAt}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => openEditModal(category)}
                      >
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">8</span> categories
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
      
      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Add New Category</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </CustomButton>
              <CustomButton onClick={handleAddCategory}>
                Add Category
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Edit Category</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </CustomButton>
              <CustomButton onClick={handleEditCategory}>
                Save Changes
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryManagement;
