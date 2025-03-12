import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import CustomButton from '../components/ui/CustomButton';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigate('/admin/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">Sign in to your admin account</p>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <Lock className="mr-2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            
            <CustomButton type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
