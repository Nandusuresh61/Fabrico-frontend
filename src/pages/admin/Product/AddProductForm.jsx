import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../../redux/features/productSlice';
import { fetchBrands } from '../../../redux/features/brandSlice';
import { getAllCategories } from '../../../redux/features/categorySlice';
import { useToast } from '../../../hooks/use-toast';

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

const AddProductForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.category);
  
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
  });
  
  const [variants, setVariants] = useState([{
    color: '',
    quantity: 1,
    price: '',
    images: []
  }]);
  const [previewUrls, setPreviewUrls] = useState([[]]);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(getAllCategories());
  }, [dispatch]);

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

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    if (variants.length < 5) {
      setVariants([...variants, { color: '', quantity: 1, price: '', images: [] }]);
      setPreviewUrls([...previewUrls, []]);
    }
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updatedVariants = variants.filter((_, i) => i !== index);
      const updatedPreviews = previewUrls.filter((_, i) => i !== index);
      setVariants(updatedVariants);
      setPreviewUrls(updatedPreviews);
    }
  };

  const handleImageUpload = (e, variantIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviewUrls = [...previewUrls];
    const newImages = [...variants[variantIndex].images];

    files.forEach(file => {
      if (newImages.length < 3) {
        const url = URL.createObjectURL(file);
        newPreviewUrls[variantIndex].push(url);
        newImages.push(file);
      }
    });

    setPreviewUrls(newPreviewUrls);
    handleVariantChange(variantIndex, 'images', newImages);
  };

  const removeImage = (variantIndex, imageIndex) => {
    const newPreviewUrls = [...previewUrls];
    const newImages = [...variants[variantIndex].images];
    
    URL.revokeObjectURL(newPreviewUrls[variantIndex][imageIndex]);
    newPreviewUrls[variantIndex] = newPreviewUrls[variantIndex].filter((_, i) => i !== imageIndex);
    newImages.splice(imageIndex, 1);
    
    setPreviewUrls(newPreviewUrls);
    handleVariantChange(variantIndex, 'images', newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all variants have required images
    const hasInvalidVariants = variants.some(variant => variant.images.length < 3);
    if (hasInvalidVariants) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Each variant must have at least 3 images",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...productData,
        variants: variants.map(({ color, quantity, price }) => ({
          color,
          quantity,
          price
        }))
      }));

      // Append images for each variant
      variants.forEach((variant, variantIndex) => {
        variant.images.forEach((image, imageIndex) => {
          formData.append(`variant${variantIndex}`, image);
        });
      });

      await dispatch(addProduct(formData)).unwrap();
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "Failed to add product",
      });
    }
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
                  {brands.map(brand => (
                    <SelectItem key={brand._id} value={brand._id}>
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
                  {categories.map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Variant {variantIndex + 1}</h3>
                  {variants.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeVariant(variantIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Color*
                    </label>
                    <Input
                      value={variant.color}
                      onChange={(e) => handleVariantChange(variantIndex, 'color', e.target.value)}
                      placeholder="Enter color"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Price*
                    </label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(variantIndex, 'price', e.target.value)}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Quantity*
                    </label>
                    <Input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => handleVariantChange(variantIndex, 'quantity', parseInt(e.target.value) || 1)}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                </div>

                {/* Variant Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images* (Min 3)
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {previewUrls[variantIndex]?.map((url, imageIndex) => (
                      <div key={imageIndex} className="relative h-32 bg-gray-50 rounded-md border border-gray-200">
                        <img 
                          src={url} 
                          alt={`Variant ${variantIndex + 1} image ${imageIndex + 1}`} 
                          className="h-full w-full object-contain rounded-md" 
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage(variantIndex, imageIndex)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {variant.images.length < 3 && (
                      <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-50 cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <label htmlFor={`variant-${variantIndex}-upload`} className="cursor-pointer text-sm text-center">
                          <span className="text-primary font-medium">Click to upload</span>
                          <input
                            id={`variant-${variantIndex}-upload`}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, variantIndex)}
                            className="hidden"
                            disabled={variant.images.length >= 3}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{3 - variant.images.length} remaining</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
