import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../../components/ui/CustomButton';
import { useToast } from "../../hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      // Mock successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Reset link sent",
        description: `Instructions to reset your password have been sent to ${email}`,
      });
      
      navigate('/otp-verification', { state: { email } });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reset link",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/login" className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Reset your password</h1>
            <p className="text-gray-600">
              Enter the email address associated with your account, and we'll send you a verification code to reset your password.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            
            <CustomButton type="submit" fullWidth isLoading={isLoading}>
              Send Reset Instructions
            </CustomButton>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
