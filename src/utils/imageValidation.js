const validateImage = (file) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPEG, PNG and WebP images are allowed'
      };
    }
  
    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image size should be less than 2MB'
      };
    }
  
    return { isValid: true };
  };
  
  export default validateImage;