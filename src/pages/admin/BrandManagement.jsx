import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
// import AdminLayout from '../../components/layout/AdminLayout';
import CustomButton from '../../components/ui/CustomButton';

// Mock brand data
const brands = [
  { id: 1, name: 'CapCraft', products: 20, createdAt: '2023-05-01' },
  { id: 2, name: 'UrbanLid', products: 15, createdAt: '2023-05-10' },
  { id: 3, name: 'HeadStyle', products: 18, createdAt: '2023-05-15' },
  { id: 4, name: 'StreetCrown', products: 12, createdAt: '2023-06-01' },
  { id: 5, name: 'TopHat', products: 8, createdAt: '2023-06-10' },
  { id: 6, name: 'CrownFit', products: 10, createdAt: '2023-06-15' },
];

const BrandManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [newBrandName, setNewBrandName] = useState('');

  const handleAddBrand = () => {
    // Add brand logic
    setIsAddModalOpen(false);
    setNewBrandName('');
  };

  const handleEditBrand = () => {
    // Edit brand logic
    setIsEditModalOpen(false);
    setSelectedBrand(null);
  };

  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setNewBrandName(brand.name);
    setIsEditModalOpen(true);
  };

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
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{brand.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {brand.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {brand.products}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {brand.createdAt}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-gray-600 hover:text-primary"
                        onClick={() => openEditModal(brand)}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">6</span> brands
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
