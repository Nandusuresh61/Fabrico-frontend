import React, { useState } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

import uploadImageToCloudinary from '../../../utils/uploadImage';

// Sample data for dropdowns
const BRANDS = [
  { id: 1, name: 'CapCraft' },
  { id: 2, name: 'UrbanLid' },
  { id: 3, name: 'HeadStyle' },
  { id: 4, name: 'StreetCrown' },
];

const CATEGORIES = [
  { id: 1, name: 'Baseball Caps' },
  { id: 2, name: 'Snapbacks' },
  { id: 3, name: 'Trucker Caps' },
  { id: 4, name: 'Fitted Caps' },
  { id: 5, name: 'Dad Hats' },
];

const COLORS = [
  { id: 1, name: 'Black', hex: '#000000' },
  { id: 2, name: 'White', hex: '#FFFFFF' },
  { id: 3, name: 'Red', hex: '#FF0000' },
  { id: 4, name: 'Blue', hex: '#0000FF' },
  { id: 5, name: 'Green', hex: '#00FF00' },
  { id: 6, name: 'Yellow', hex: '#FFFF00' },
  { id: 7, name: 'Gray', hex: '#808080' },
];

const STATUSES = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Blocked' },
];

const AddProductForm = ({ onClose, onSubmit }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    discountPrice: '',
    description: '',
    status: 'Active', // Default status
  });
  
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([{ color: '', quantity: 1 }]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleVariantColorChange = (index, color) => {
    const updatedVariants = [...variants];
    updatedVariants[index].color = color;
    setVariants(updatedVariants);
  };

  const handleVariantQuantityChange = (index, quantity) => {
    const updatedVariants = [...variants];
    updatedVariants[index].quantity = quantity;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    if (variants.length < 5) { // Limit to 5 variants
      setVariants([...variants, { color: '', quantity: 1 }]);
    }
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updatedVariants = variants.filter((_, i) => i !== index);
      setVariants(updatedVariants);
    }
  };


  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
  
    const newPreviewUrls = [...previewUrls];
    const newImages = [...images];
  
    for (const file of files) {
      if (newImages.length < 3) {
        try {
          const uploadedUrl = await uploadToCloudinary(file);
          newImages.push(uploadedUrl);
          newPreviewUrls.push(uploadedUrl);
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
    }
  
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };
  

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    
    // Clean up object URLs to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    setImages(updatedImages);
    setPreviewUrls(updatedPreviewUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...productData,
      images,
      variants,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto ${isMobile ? 'w-full' : 'w-[700px]'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Add New Product</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <Input
              id="name"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Brand and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand*
              </label>
              <Select 
                value={productData.brand} 
                onValueChange={(value) => handleSelectChange('brand', value)}
              >
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map(brand => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <Select 
                value={productData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price and Discount Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={productData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price
              </label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                step="0.01"
                min="0"
                value={productData.discountPrice}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status*
            </label>
            <Select 
              value={productData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(status => (
                  <SelectItem key={status.id} value={status.name}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images* (Max 3)
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative h-32 bg-gray-50 rounded-md border border-gray-200">
                  <img 
                    src={url} 
                    alt={`Product image ${index + 1}`} 
                    className="h-full w-full object-contain rounded-md" 
                  />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {images.length < 3 && (
                <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <label htmlFor="image-upload" className="cursor-pointer text-sm text-center">
                    <span className="text-primary font-medium">Click to upload</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={images.length >= 3}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">{3 - images.length} remaining</p>
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Variants*
              </label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addVariant}
                disabled={variants.length >= 5}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Variant
              </Button>
            </div>
            
            {variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-4 mb-3 p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Color
                  </label>
                  <Select 
                    value={variant.color} 
                    onValueChange={(value) => handleVariantColorChange(index, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map(color => (
                        <SelectItem key={color.id} value={color.name}>
                          <div className="flex items-center">
                            <div 
                              className="h-4 w-4 rounded-full mr-2" 
                              style={{ backgroundColor: color.hex, border: color.name === 'White' ? '1px solid #ccc' : 'none' }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-32">
                  <label className="block text-xs text-gray-500 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleVariantQuantityChange(index, Math.max(1, variant.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={variant.quantity}
                      onChange={(e) => handleVariantQuantityChange(index, parseInt(e.target.value) || 1)}
                      className="mx-1 text-center h-8"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleVariantQuantityChange(index, variant.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {variants.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => removeVariant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Product Description*
            </label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Enter product description..."
              required
            />
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
