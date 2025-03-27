import { useState } from 'react';
import { MapPin, PlusCircle, Pencil, Trash2, Check, Home, Briefcase } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';

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
      country: 'United States',
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
      country: 'United States',
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
    country: '',
    isDefault: false,
  });

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
      country: '',
      isDefault: false,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Addresses</h2>
        {!isAdding && (
          <CustomButton 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            icon={<PlusCircle className="h-4 w-4" />}
          >
            Add New Address
          </CustomButton>
        )}
      </div>
      {/* Additional UI and logic remain the same */}
    </div>
  );
};

export default AddressSection;
