import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, addCategory, editCategory, deleteCategory } from '../../redux/features/categorySlice';
import { Edit, Trash2, Plus } from 'lucide-react';

import CustomButton from '../../components/ui/CustomButton';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
 let count = 1;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
     dispatch(addCategory({ name: newCategoryName }));
      setIsAddModalOpen(false);
      setNewCategoryName('');
    }
  };

  const handleEditCategory = async () => {
    if (newCategoryName.trim() && selectedCategory) {
     dispatch(editCategory({ categoryId: selectedCategory._id, data: { name: newCategoryName } }));
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    }
  };


  const handleDeleteCategory = async (categoryId) => {
   dispatch(deleteCategory(categoryId));
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
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    Loading categories...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {count++}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    <span 
                    
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      category.status === 'Activated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status}
                    </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-gray-600 hover:text-primary"
                          onClick={() => openEditModal(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={()=>handleDeleteCategory(category._id)} className={`cursor-pointer ${
                      category.status  === 'Activated' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`} >
                      {category.status == "Activated" ? "Deactivate" : 'Activate'}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Add New Category</h2>
            <div className="mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton onClick={() => setIsAddModalOpen(false)}>
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
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton onClick={() => setIsEditModalOpen(false)}>
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
