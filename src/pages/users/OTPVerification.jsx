import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../../components/ui/CustomButton';
import { useToast } from "../../hooks/use-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const email = location.state?.email || 'your email';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle paste event with multiple characters
    if (value.length > 1) {
      const digits = value.split('').filter(char => /\d/.test(char)).slice(0, 6);
      const newOtpArray = [...otp];
      
      digits.forEach((digit, idx) => {
        if (idx < 6) {
          newOtpArray[index + idx] = digit;
        }
      });
      
      setOtp(newOtpArray);
      
      // Focus on the appropriate input after paste
      const nextIndex = Math.min(index + digits.length, 5);
      if (nextIndex < 6) {
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }
    
    // Handle single character input
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Go back on backspace if current field is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setTimeLeft(60);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP resent",
        description: `A new verification code has been sent to ${email}`,
      });
      
      // Restart the timer
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Failed to resend OTP",
        description: "Please try again later",
      });
      setResendDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.some(digit => !digit)) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the complete verification code",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      // Mock successful verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Verification successful",
        description: "Your account has been verified",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "The code you entered is incorrect",
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
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </button>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Verify your email</h1>
            <p className="text-gray-600">
              We've sent a verification code to <strong>{email}</strong>. Please enter the code below.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold text-gray-900 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary sm:h-14 sm:w-14"
                  required
                />
              ))}
            </div>
            
            {/* Countdown timer */}
            <div className="text-center">
              {resendDisabled ? (
                <p className="text-sm text-gray-600">
                  Resend code in <span className="font-medium">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Resend verification code
                </button>
              )}
            </div>
            
            <CustomButton type="submit" fullWidth isLoading={isLoading}>
              Verify Email
            </CustomButton>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default OTPVerification;
