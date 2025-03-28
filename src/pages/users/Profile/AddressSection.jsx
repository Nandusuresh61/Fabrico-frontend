import { useState } from 'react';
import { MapPin, PlusCircle, Pencil, Trash2, Check, Home, Briefcase } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';

const AddressSection = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      name: 'John Doe',
      street: '456 Business Ave, Floor 8',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      phone: '+1 (555) 987-6543',
      isDefault: false,
    },
  ]);
  
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddAddress = () => {
    const newAddress = {
      ...formData,
      id: Date.now().toString(),
    };
    
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: false
      })));
    }
    
    setAddresses((prev) => [...prev, newAddress]);
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditAddress = () => {
    if (!editingId) return;
    
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === editingId ? formData.isDefault : false
      })));
    }
    
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === editingId
          ? { ...formData, id: editingId }
          : addr
      )
    );
    
    resetForm();
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const startEdit = (address) => {
    setFormData({ ...address });
    setEditingId(address.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDefaultChange = (addressId) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Addresses</h2>
        <CustomButton 
          variant="outline" 
          size="sm" 
          onClick={() => setIsModalOpen(true)}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          + ADD A NEW ADDRESS
        </CustomButton>
      </div>

      {/* Updated Address Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {address.type === 'home' ? (
                  <Home className="h-4 w-4 text-blue-500" />
                ) : (
                  <Briefcase className="h-4 w-4 text-green-500" />
                )}
                <span className="font-medium capitalize">{address.type}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(address)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{address.name}</p>
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
              <p className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {address.phone}
              </p>
            </div>
            <div className="mt-3 flex items-center border-t pt-3">
              <input
                type="checkbox"
                id={`default-${address.id}`}
                checked={address.isDefault}
                onChange={() => handleDefaultChange(address.id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor={`default-${address.id}`} 
                className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
              >
                Set as default address
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingId ? "Edit Address" : "Add New Address"}
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <CustomButton
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={editingId ? handleEditAddress : handleAddAddress}
            >
              {editingId ? 'Save Changes' : 'Save Address'}
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressSection;
