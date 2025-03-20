import { useState, useEffect } from 'react';

const EditProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    discount: product.discount || '',
    category: product.category?._id || '',
    brand: product.brand?._id || '',
    stock: product.stock || '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product.images || []);

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
        <h2 className="text-lg font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Name"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Description"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Price"
          />
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Discount"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Stock"
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border rounded p-2 w-full"
          />
          
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

          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
