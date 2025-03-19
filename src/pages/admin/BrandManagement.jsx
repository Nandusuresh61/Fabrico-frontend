import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
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
  const { brands, loading, error } = useSelector((state) => state.brands);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

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
    await dispatch(toggleBrandStatus(brandId));
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
        
        {/* Brands Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{brand._id.slice(-6)}
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
                        className="text-gray-600 hover:text-red-500"
                        onClick={() => handleToggleStatus(brand._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
