import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Cleanup old preview URLs
    previewImages.forEach(url => URL.revokeObjectURL(url));
    
    setFormData(prev => ({
      ...prev,
      images: files,
    }));

    // Create new preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

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
  );
};

export default EditProductForm;
