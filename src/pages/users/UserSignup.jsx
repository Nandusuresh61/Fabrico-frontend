import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';
import Layout from '../../components/layout/Layout'
import CustomButton from '../../components/ui/CustomButton';
import { useToast } from "../../hooks/use-toast";
import { useDispatch, useSelector} from 'react-redux'
import { registerUser } from '../../redux/features/userSlice';

const UserSignup = () => {
const { loading, error} = useSelector((state)=>state.user);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
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
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const passedRequirements = passwordRequirements.filter(req => req.test(formData.password));
      if (passedRequirements.length < passwordRequirements.length) {
        newErrors.password = 'Password does not meet all requirements';
        isValid = false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!validateForm())return;

    try {
      const resultAction = await dispatch(registerUser({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      }));

      if(registerUser.fulfilled.match(resultAction)){
        toast({
          title: "Registeration successful!",
          description: "Please verify user email!",
        });
        navigate('/otp-verification',{state: {email: formData.email}});
      }else{
        toast({
          variant : "destructive ",
          title: "Registration Failed",
          description: resultAction.payload || "Please try again",
        });
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later",
      });
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
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Create an account</h1>
            <p className="text-gray-600">Join FABRICO to start shopping premium caps</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Full Name"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password requirements */}
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <li key={req.id} className="flex items-center text-xs">
                      {req.test(formData.password) ? (
                        <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span className={req.test(formData.password) ? 'text-gray-700' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <CustomButton type="submit" fullWidth isLoading={isLoading}>
              Create Account
            </CustomButton>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserSignup;
