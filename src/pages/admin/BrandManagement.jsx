import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CustomButton from '../../components/ui/CustomButton';
import { 
    fetchBrands, 
    createBrand, 
    updateBrand, 
    toggleBrandStatus,
    clearError 
} from '../../redux/features/brandSlice';

const BrandManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { brands, loading, error, page, totalPages, total } = useSelector((state) => state.brands);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortField') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  const [loadingBrands, setLoadingBrands] = useState({});

  const updateUrlAndFetch = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...newParams };
    
    // Remove empty params
    Object.keys(updatedParams).forEach(key => 
      !updatedParams[key] && delete updatedParams[key]
    );

    setSearchParams(updatedParams);
    dispatch(fetchBrands(updatedParams));
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
    dispatch(fetchBrands(params));
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

  const handleAddBrand = async () => {
    if (!newBrandName) {
      return;
    }

    await dispatch(createBrand({
      name: newBrandName
    }));

    setIsAddModalOpen(false);
    setNewBrandName('');
  };

  const handleEditBrand = async () => {
    if (!newBrandName) {
      return;
    }

    await dispatch(updateBrand({
      id: selectedBrand._id,
      brandData: {
        name: newBrandName
      }
    }));

    setIsEditModalOpen(false);
    setSelectedBrand(null);
    setNewBrandName('');
  };

  const handleToggleStatus = async (brandId) => {
    try {
      setLoadingBrands(prev => ({ ...prev, [brandId]: true }));
      await dispatch(toggleBrandStatus(brandId)).unwrap();
    } catch (error) {
      // Handle error if needed
    } finally {
      setLoadingBrands(prev => ({ ...prev, [brandId]: false }));
    }
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setNewBrandName(brand.name);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
    let count =1;
  return (
    <>
      <div className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Brand Management</h1>
          <CustomButton 
            icon={<Plus className="h-4 w-4" />} 
            iconPosition="left"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Brand
          </CustomButton>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-6 flex gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
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
        
        {/* Brands Table */}
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
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                  Created Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {count++}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {brand.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      brand.status === 'Activated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {brand.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => openEditModal(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(brand._id)}
                        disabled={loadingBrands[brand._id]}
                        className={`text-gray-500 ${
                          brand.status === 'Activated' 
                            ? 'hover:text-red-500' 
                            : 'hover:text-green-500'
                        } ${loadingBrands[brand._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loadingBrands[brand._id] ? (
                          <span className="inline-block animate-spin">⌛</span>
                        ) : (
                          brand.status === 'Activated' ? 'Deactivate' : 'Activate'
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
            Showing {brands.length} of {total} results
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
      
      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Add New Brand</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Brand Name</label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter brand name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </CustomButton>
              <CustomButton onClick={handleAddBrand}>
                Add Brand
              </CustomButton>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Brand Modal */}
      {isEditModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Edit Brand</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Brand Name</label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </CustomButton>
              <CustomButton onClick={handleEditBrand}>
                Save Changes
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandManagement;
