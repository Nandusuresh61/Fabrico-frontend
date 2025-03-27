import { useState } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/ui/CustomButton';

const UserLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    
    // Simulate logout API call
    setTimeout(() => {
      // Redirect to home page after logout
      navigate('/');
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto text-center">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <LogOut className="h-10 w-10 text-red-500" />
        </div>
        
        <h2 className="mt-6 text-2xl font-bold">Sign Out</h2>
        
        <p className="mt-3 text-gray-600">
          Are you sure you want to sign out of your account? You'll need to login again to access your profile.
        </p>
        
        <div className="mt-8 w-full rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
            <div>
              <p className="text-sm text-yellow-700">
                Any unsaved changes in your current session may be lost. Make sure you've saved any important information before logging out.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex w-full gap-4">
          <CustomButton
            variant="outline"
            fullWidth
            onClick={() => navigate('/profile')}
          >
            Cancel
          </CustomButton>
          
          <CustomButton
            fullWidth
            className="bg-red-600 hover:bg-red-700 text-white"
            icon={<LogOut className="h-4 w-4" />}
            isLoading={isLoading}
            onClick={handleLogout}
          >
            Sign Out
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default UserLogout;
