import { useState } from 'react';
import { KeyRound, EyeOff, Eye, Check, X } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../redux/features/userSlice';
import { useToast } from "../../../hooks/use-toast";

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { toast } = useToast();

  const passwordRequirements = [
    { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { id: 'lowercase', label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
    { id: 'uppercase', label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { id: 'number', label: 'Contains number', test: (p) => /[0-9]/.test(p) },
    { id: 'special', label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else {
      const passedRequirements = passwordRequirements.filter(req => 
        req.test(formData.newPassword)
      );
      if (passedRequirements.length < passwordRequirements.length) {
        newErrors.newPassword = 'Password does not meet all requirements';
        isValid = false;
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (formData.currentPassword === formData.newPassword) {
      setErrors(prev => ({
        ...prev,
        newPassword: 'New password must be different from current password'
      }));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await dispatch(changePassword({ 
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword 
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: error || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <p className="mt-1 text-sm text-gray-600">Update your password to keep your account secure</p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <div className="relative">
            <input
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <div className="relative">
            <input
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password requirements */}
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-gray-700">Password requirements:</p>
            <ul className="space-y-1">
              {passwordRequirements.map((req) => (
                <li key={req.id} className="flex items-center text-xs">
                  {req.test(formData.newPassword) ? (
                    <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                  )}
                  <span className={req.test(formData.newPassword) ? 'text-gray-700' : 'text-gray-500'}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        <CustomButton 
          type="submit" 
          icon={<KeyRound className="h-4 w-4" />}
          isLoading={isLoading}
        >
          Update Password
        </CustomButton>
      </form>
    </div>
  );
};

export default PasswordChange;
