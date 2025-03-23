import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../../components/ui/CustomButton';
import { useToast } from "../../hooks/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/userSlice';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const dispatch = useDispatch();
  
  // Get loading and error state from Redux
  const { loading, error, user } = useSelector((state) => state.user);

  useEffect(()=>{
    if(user){
      navigate('/profile')
    }
  },[user])

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${result?.name || "User"}!`,
      });

      navigate('/'); // Redirect to homepage on success
    } catch (err) {
      // Check if the error indicates a blocked account
      if (err.includes('blocked')) {
        toast({
          variant: "destructive",
          title: "Account Blocked",
          description: "Your account has been blocked. Please contact support.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: err || "Invalid email or password",
        });
      }
    }
  };

  return (
    <Layout hideFooter>
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <CustomButton type="submit" fullWidth isLoading={loading}>
              Sign In
            </CustomButton>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols gap-3">
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserLogin;
