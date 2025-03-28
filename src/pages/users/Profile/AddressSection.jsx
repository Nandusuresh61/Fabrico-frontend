import { useState, useEffect } from 'react';
import { MapPin, PlusCircle, Pencil, Trash2, Check, Home, Briefcase } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAddresses, 
  addNewAddress, 
  updateExistingAddress, 
  removeAddress,
  setAddressAsDefault 
} from '../../../redux/features/addressSlice';
import { useToast } from '../../../hooks/use-toast';

const AddressSection = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const dispatch = useDispatch();
  const {toast} = useToast();
  const { addresses, loading } = useSelector(state => state.address);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

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

  const handleAddAddress = (e) => {
    e.preventDefault();
    
    const addressData = {
      type: formData.type,
      name: formData.name,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      phone: formData.phone,
      isDefault: formData.isDefault
    };

    dispatch(addNewAddress(addressData));
    console.log(addressData)
    resetForm();
    setIsModalOpen(false);
  };

  const handleEditAddress = (e) => {
    e.preventDefault();
    if (!editingId) return;
    
    const addressData = {
      type: formData.type,
      name: formData.name,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      phone: formData.phone,
      isDefault: formData.isDefault
    };

    dispatch(updateExistingAddress({ id: editingId, addressData }));
    resetForm();
    setIsModalOpen(false);
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    
    try {
      await dispatch(removeAddress(addressToDelete._id)).unwrap();
      dispatch(fetchAddresses());
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  };

  const startEdit = (address) => {
    setFormData({
      type: address.type || 'home',
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.pincode,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setEditingId(address._id);
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
    dispatch(setAddressAsDefault(addressId));
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
          ADD A NEW ADDRESS
        </CustomButton>
      </div>

      {/* Updated Address Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address._id}
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
                  onClick={() => handleDeleteClick(address)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{address.name}</p>
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.pincode}`}</p>
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
                onChange={() => handleDefaultChange(address._id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor={`default-${address._id}`} 
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
        <form onSubmit={editingId ? handleEditAddress : handleAddAddress} className="space-y-4">
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
                Pincode
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
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
            >
              {editingId ? 'Save Changes' : 'Save Address'}
            </CustomButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setAddressToDelete(null);
        }}
        title="Delete Address"
      >
        <div className="space-y-4">
          {addressToDelete && (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-900">{addressToDelete.name}</p>
              <p className="text-sm text-gray-600">{addressToDelete.street}</p>
              <p className="text-sm text-gray-600">
                {`${addressToDelete.city}, ${addressToDelete.state} ${addressToDelete.pincode}`}
              </p>
            </div>
          )}
          
          <p className="text-gray-600">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setAddressToDelete(null);
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="hover:bg-red-600"
            >
              Delete Address
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressSection;
