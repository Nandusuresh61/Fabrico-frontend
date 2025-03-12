import { useState } from 'react';
import { User, Mail, Camera, LogOut } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../..//components/ui/CustomButton';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1740&auto=format&fit=crop',
  });
  
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserData((prev) => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container px-4 py-12 md:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
          
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32">
                  <img src={userData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <p className="text-gray-600">{userData.email}</p>
                    <div className="mt-4">
                      <CustomButton 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </CustomButton>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                      <div className="flex items-center rounded-md border border-gray-300 px-3 py-2">
                        <User className="mr-2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="flex-1 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                      <div className="flex items-center rounded-md border border-gray-300 px-3 py-2">
                        <Mail className="mr-2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="flex-1 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <CustomButton onClick={handleSave}>Save Changes</CustomButton>
                      <CustomButton variant="outline" onClick={handleCancel}>Cancel</CustomButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Account Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your password for better security</p>
                </div>
                <CustomButton variant="outline" size="sm">Change</CustomButton>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <h3 className="font-medium">Notification Settings</h3>
                  <p className="text-sm text-gray-600">Manage your email and app notifications</p>
                </div>
                <CustomButton variant="outline" size="sm">Manage</CustomButton>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                </div>
                <CustomButton variant="outline" size="sm">Delete</CustomButton>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <CustomButton 
              variant="ghost" 
              icon={<LogOut className="h-4 w-4" />}
              iconPosition="left"
            >
              Sign Out
            </CustomButton>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
