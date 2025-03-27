import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, X, Upload } from 'lucide-react';
import CustomButton from '../../../components/ui/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, sendEmailUpdateOtp, verifyEmailUpdate } from '../../../redux/features/userSlice';
import { useToast } from "../../../hooks/use-toast";

const PersonalInformation = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, loading } = useSelector((state) => state.user);
  
  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    profileImage: user.profileImage
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Add your image upload logic here
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
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
      // Update other fields directly
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
                src={formData.profileImage}
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
                    loading={loading}
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
                  src={formData.profileImage}
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <CustomButton
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleUpdate}
                loading={loading}
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
                loading={loading}
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
