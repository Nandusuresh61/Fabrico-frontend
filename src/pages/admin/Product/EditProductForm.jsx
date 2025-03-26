import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const EditProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    color: product.variant.color || '',
    price: product.variant.price || '',
    stock: product.variant.stock || '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([
    product.variant.mainImage,
    ...product.variant.subImages
  ].filter(Boolean));

  // Add new state for crop functionality
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  // Cleanup function for preview URLs
  useEffect(() => {
    return () => {
      // Cleanup preview URLs when component unmounts
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        blob.name = 'cropped.jpeg';
        const croppedFile = new File([blob], 'cropped.jpeg', { type: 'image/jpeg' });
        resolve(croppedFile);
      }, 'image/jpeg', 1);
    });
  }, [completedCrop]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setCurrentImage(URL.createObjectURL(files[0]));
    setCropModalOpen(true);
  };

  const handleCropComplete = useCallback(async () => {
    const croppedFile = await getCroppedImg();
    if (!croppedFile) return;

    // Cleanup old preview URLs
    previewImages.forEach(url => URL.revokeObjectURL(url));

    const newPreviewUrl = URL.createObjectURL(croppedFile);
    setPreviewImages([...previewImages, newPreviewUrl]);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, croppedFile],
    }));

    setCropModalOpen(false);
    setCurrentImage(null);
    setCompletedCrop(null);
  }, [getCroppedImg, previewImages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    
    // Append basic form data
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        data.append(key, formData[key]);
      }
    });

    // Append new images if any
    formData.images.forEach(file => {
      data.append('images', file);
    });

    // Append existing images that should be kept
    data.append('existingImages', JSON.stringify(existingImages));

    onSubmit(data);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Edit Variant</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full"
                accept="image/*"
              />
            </div>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="font-medium mb-2">Existing Images:</p>
                <div className="flex gap-2 overflow-x-auto">
                  {existingImages.map((src, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img src={src} alt="Existing" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {previewImages.length > 0 && (
              <div>
                <p className="font-medium mb-2">New Images:</p>
                <div className="flex gap-2 overflow-x-auto">
                  {previewImages.map((src, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img src={src} alt="Preview" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Variant
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Crop Image</h3>
              <button
                onClick={() => {
                  setCropModalOpen(false);
                  setCurrentImage(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={currentImage}
                  alt="Crop"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCropModalOpen(false);
                  setCurrentImage(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropComplete}
                disabled={!completedCrop}
              >
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProductForm;
