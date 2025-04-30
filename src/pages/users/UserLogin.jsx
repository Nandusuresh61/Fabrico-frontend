import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../../components/ui/CustomButton';
import { useToast } from "../../hooks/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/userSlice';
import GoogleLogin from '../../pages/users/GoogleLogin'

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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Email validation
    if (!email) {
        newErrors.email = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
    } else if (email.length > 254) {
        newErrors.email = 'Email address is too long';
        isValid = false;
    }

    // Password validation
    if (!password) {
        newErrors.password = 'Password is required';
        isValid = false;
    } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
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
        description: `Welcome back, ${result?.username || "User"}!`,
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
      } else if (err.includes('not verified')) {
        toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please verify your email address to continue.",
        });
        navigate('/otp-verification', { state: { email } });
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
            
            <GoogleLogin/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserLogin;
