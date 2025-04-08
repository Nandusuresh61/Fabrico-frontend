import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary configuration is missing');
    throw new Error('Cloudinary configuration is missing');
  }

  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      }
    );

    if (!response.data || !response.data.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }

    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    if (error.response?.data?.error?.message) {
      throw new Error(`Upload failed: ${error.response.data.error.message}`);
    } else if (error.message) {
      throw new Error(`Upload failed: ${error.message}`);
    } else {
      throw new Error('Failed to upload image to Cloudinary');
    }
  }
};
