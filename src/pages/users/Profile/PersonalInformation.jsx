import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, X, Upload, Copy, Share2 } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, sendEmailUpdateOtp, verifyEmailUpdate } from '../../../redux/features/userSlice';
import { useToast } from "../../../hooks/use-toast";
import { uploadToCloudinary } from '../../../api/cloudinary';

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, loading } = useSelector((state) => state.user);
  const [errors, setErrors] = useState({
    username: '',
    phone: '',
    email: ''
  });
  const [originalData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    profileImage: user.profileImage,
    referralCode: user.referralCode || ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    profileImage: user.profileImage,
    referralCode: user.referralCode || ''
  });

  const [originalEmail] = useState(user.email);

  useEffect(() => {
    let timer;
    if (showOtpModal && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setErrors(prev => ({ ...prev, username: validateUsername(value) }));
    }
    
    if (name === 'phone') {
      if (value && !/^\d*$/.test(value)) {
        return; 
      }
      if (value.length > 10) {
        return; 
      }
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }

    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Image size should be less than 5MB"
          });
          return;
        }

        
        if (!file.type.startsWith('image/')) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please upload an image file"
          });
          return;
        }

        
        const previewUrl = URL.createObjectURL(file);
        
        
        const imageUrl = await uploadToCloudinary(file);
        
        
        setFormData(prev => ({ ...prev, profileImage: imageUrl }));
        
        
        URL.revokeObjectURL(previewUrl);
        
        toast({
          title: "Success",
          description: "Profile picture uploaded successfully"
        });
      } catch (error) {
        console.error('Image upload error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to upload profile picture"
        });
        // Revert to original image if upload fails
        setFormData(prev => ({ ...prev, profileImage: user.profileImage }));
      }
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleUpdate = async () => {
    const usernameError = validateUsername(formData.username);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    
    const newErrors = {
      username: usernameError,
      phone: phoneError,
      email: emailError
  };
  
  setErrors(newErrors);
  if (Object.values(newErrors).some(error => error !== '')) {
    return;
}
    if (formData.email !== originalEmail) {
      // Send OTP for email verification
      try {
        await dispatch(sendEmailUpdateOtp({ newEmail: formData.email })).unwrap();
        setShowOtpModal(true);
        setTimeLeft(60);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to send verification code"
        });
      }
    } else {
      
      try {
        await dispatch(updateProfile(formData)).unwrap();
        setShowModal(false);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Failed to update profile"
        });
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter complete verification code"
        });
        return;
    }

    try {
        const result = await dispatch(verifyEmailUpdate({ otp: otpString })).unwrap();
        
        // Update formData with new email
        setFormData(prev => ({
            ...prev,
            email: result.email
        }));
        
        setShowOtpModal(false);
        setShowModal(false);
        toast({
            title: "Success",
            description: "Email updated successfully"
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error || "Verification failed"
        });
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(sendEmailUpdateOtp({ newEmail: formData.email })).unwrap();
      setTimeLeft(60);
      toast({
        title: "Success",
        description: "Verification code resent"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Failed to resend verification code"
      });
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(formData.referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard"
    });
  };

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join FABRICO with my referral code',
        text: `Use my referral code ${formData.referralCode} to get ₹200 in your wallet when you sign up!`,
        url: window.location.origin
      }).catch(err => console.error('Error sharing:', err));
    } else {
      copyReferralCode();
    }
  };


  const validateUsername = (value) => {
    if (!value) {
      return 'Username is required';
  }
    if (value.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return 'Username can only contain letters and spaces';
    }
    return '';
  };

  const validatePhone = (value) => {
    if (!value) {
      return 'phone number  is required';
  }
    if (!/^\d{10}$/.test(value)) {
      return 'Phone number must be 10 digits';
    }
    if (/^0{10}$/.test(value)) {
      return 'Invalid phone number';
    }
    return '';
  };
  const validateEmail = (value) => {
    if (!value) {
        return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
    }
    return '';
};

const handleCloseModal = () => {

  setFormData({
    username: originalData.username,
    email: originalData.email,
    phone: originalData.phone,
    profileImage: originalData.profileImage,
    referralCode: originalData.referralCode
  });

  setErrors({
    username: '',
    phone: '',
    email: ''
  });
  setShowModal(false);
};

  return (
    <>
      <div className="animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          {!showModal && (
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              Edit
            </CustomButton>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="mb-6 md:mb-0">
            <div className="relative h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32">
              <img
                src={formData.profileImage || '/prof.jpg'}
                alt="Profile"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-1">
            {!showModal ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <span className="text-sm font-medium text-gray-500">Name</span>
                    <p className="mt-1 font-medium">{formData.username}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <span className="text-sm font-medium text-gray-500">Email Address</span>
                    <p className="mt-1 font-medium">{formData.email}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <span className="text-sm font-medium text-gray-500">Mobile Number</span>
                    <p className="mt-1 font-medium">{formData.phone}</p>
                  </div>
                </div>

                {/* Referral Code Section */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Your Referral Code</span>
                      <div className="mt-1 flex items-center">
                        <p className="font-medium text-lg">{formData.referralCode}</p>
                        <div className="ml-2 flex space-x-2">
                          <button 
                            onClick={copyReferralCode}
                            className="p-1 rounded-full hover:bg-gray-100"
                            title="Copy code"
                          >
                            <Copy className="h-4 w-4 text-gray-500" />
                          </button>
                          <button 
                            onClick={shareReferralCode}
                            className="p-1 rounded-full hover:bg-gray-100"
                            title="Share code"
                          >
                            <Share2 className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Share this code with friends and get ₹200 in your wallet when they sign up!
                  </p>
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
                        name="username"
                        value={formData.username}
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
                        name="username"
                        value={formData.username}
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <CustomButton
                    onClick={handleUpdate}
                    isLoading={loading}
                  >
                    Update
                  </CustomButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            
            {/* Profile Image */}
            <div className="mb-4">
              <div className="relative h-24 w-24 mx-auto">
                <img
                  src={formData.profileImage || '/prof.jpg'}
                  alt="Profile"
                  className="h-full w-full object-cover rounded-full"
                />
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2`}
        />
        {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
        )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2`}
        />
        {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2`}
        />
        {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <CustomButton
                variant="outline"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleUpdate}
                isLoading={loading}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Verify Email</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the verification code sent to {formData.email}
            </p>

            {/* OTP Input */}
            <div className="flex justify-center space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center border rounded-md"
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="text-center mb-4">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">Resend code in {timeLeft}s</p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-600 text-sm"
                  disabled={loading}
                >
                  Resend Code
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <CustomButton
                variant="outline"
                onClick={() => setShowOtpModal(false)}
                disabled={loading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleVerifyOtp}
                isLoading={loading}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInformation;
