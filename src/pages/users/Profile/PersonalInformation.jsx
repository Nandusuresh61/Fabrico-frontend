import { useState } from 'react';
import { User, Mail, Phone, Save, X } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';

const PersonalInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    mobile: '+1 (555) 123-4567',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1740&auto=format&fit=crop',
  });
  
  const [formData, setFormData] = useState({ ...userData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserData((prev) => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing && (
          <CustomButton 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            Edit
          </CustomButton>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="mb-6 md:mb-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32">
            <img 
              src={userData.profilePicture} 
              alt="Profile" 
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
            />
          </div>
        </div>
        
        <div className="flex-1">
          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <span className="text-sm font-medium text-gray-500">First Name</span>
                  <p className="mt-1 font-medium">{userData.firstName}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <span className="text-sm font-medium text-gray-500">Last Name</span>
                  <p className="mt-1 font-medium">{userData.lastName}</p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <span className="text-sm font-medium text-gray-500">Email Address</span>
                  <p className="mt-1 font-medium">{userData.email}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <span className="text-sm font-medium text-gray-500">Mobile Number</span>
                  <p className="mt-1 font-medium">{userData.mobile}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
                  <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <CustomButton 
                  onClick={handleSave}
                  icon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </CustomButton>
                <CustomButton 
                  variant="outline" 
                  onClick={handleCancel}
                  icon={<X className="h-4 w-4" />}
                >
                  Cancel
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
