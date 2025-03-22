import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllCategories, addCategory, editCategory, deleteCategory } from '../../redux/features/categorySlice';
import CustomButton from '../../components/ui/CustomButton';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading, error, page, totalPages, total } = useSelector((state) => state.category);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState({});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortField') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  const updateUrlAndFetch = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...newParams };
    
    Object.keys(updatedParams).forEach(key => 
      !updatedParams[key] && delete updatedParams[key]
    );

    setSearchParams(updatedParams);
    dispatch(getAllCategories(updatedParams));
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
    dispatch(getAllCategories(params));
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    updateUrlAndFetch({ page: newPage });
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

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoadingCategories(prev => ({ ...prev, [categoryId]: true }));
      await dispatch(deleteCategory(categoryId)).unwrap();
    } catch (error) {
      // Handle error if needed
    } finally {
      setLoadingCategories(prev => ({ ...prev, [categoryId]: false }));
    }
  };

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

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="px-6 py-8">
        {/* Header */}
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

        {/* Search and Filter Section */}
        <div className="mb-6 flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="rounded-md border px-3 py-2"
            />
            <CustomButton type="submit">Search</CustomButton>
          </form>

          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Activated">Activated</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>

        {/* Categories Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('_id')}>
                  ID {sortField === '_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category._id}
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
                      <button 
                        onClick={() => handleDeleteCategory(category._id)}
                        disabled={loadingCategories[category._id]}
                        className={`${
                          category.status === 'Activated' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        } ${loadingCategories[category._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loadingCategories[category._id] ? (
                          <span className="inline-block animate-spin">⌛</span>
                        ) : (
                          category.status === "Activated" ? "Deactivate" : 'Activate'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {categories.length} of {total} results
          </div>
          <div className="flex items-center gap-2">
            <CustomButton
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              icon={<ChevronLeft className="h-4 w-4" />}
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
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </CustomButton>
          </div>
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
