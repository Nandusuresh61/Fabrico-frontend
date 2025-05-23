import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import validateImage from '../../../utils/imageValidation'

import uploadImageToCloudinary from '../../../utils/uploadImage';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


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
    quantity: 0,
    price: '',
    discountPrice: '',
    images: []
  }]);
  const [previewUrls, setPreviewUrls] = useState([[]]);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 1
  });
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

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
      [field]: field === 'quantity' ? Number(value) : value
    };
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    if (variants.length < 5) {
      setVariants([...variants, { color: '', quantity: 0, price: '', discountPrice: '', images: [] }]);
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

  const handleImageUpload = (e, variantIndex) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const file = files[0];
  const validation = validateImage(file);
  
  if (!validation.isValid) {
    toast({
      variant: "destructive",
      description: validation.error
    });
    return;
  }

    setCurrentVariantIndex(variantIndex);
    setCurrentImage(URL.createObjectURL(files[0]));
    setCropModalOpen(true);
  };

  const handleCropComplete = useCallback(async () => {
    const croppedFile = await getCroppedImg();
    if (!croppedFile) return;

    const newPreviewUrls = [...previewUrls];
    const newImages = [...variants[currentVariantIndex].images];

    if (newImages.length < 3) {
      const url = URL.createObjectURL(croppedFile);
      newPreviewUrls[currentVariantIndex].push(url);
      newImages.push(croppedFile);
    }

    setPreviewUrls(newPreviewUrls);
    handleVariantChange(currentVariantIndex, 'images', newImages);
    setCropModalOpen(false);
    setCurrentImage(null);
    setCompletedCrop(null);
  }, [currentVariantIndex, getCroppedImg, previewUrls, variants]);

  const removeImage = (variantIndex, imageIndex) => {
    const newPreviewUrls = [...previewUrls];
    const newImages = [...variants[variantIndex].images];
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[variantIndex][imageIndex]);
    
    // Remove the image from both arrays
    newPreviewUrls[variantIndex] = newPreviewUrls[variantIndex].filter((_, i) => i !== imageIndex);
    newImages.splice(imageIndex, 1);
    
    setPreviewUrls(newPreviewUrls);
    handleVariantChange(variantIndex, 'images', newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.name.trim()) {
      toast({
        variant: "destructive",
        description: "Product name is required",
      });
      return;
    }
  
    if (productData.name.length < 3 || productData.name.length > 100) {
      toast({
        variant: "destructive",
        description: "Product name must be between 3 and 100 characters",
      });
      return;
    }
  
    if (!productData.description.trim()) {
      toast({
        variant: "destructive",
        description: "Product description is required",
      });
      return;
    }
  
    if (productData.description.length < 10 || productData.description.length > 1000) {
      toast({
        variant: "destructive",
        description: "Description must be between 10 and 1000 characters",
      });
      return;
    }
  
    if (!productData.brand) {
      toast({
        variant: "destructive",
        description: "Please select a brand",
      });
      return;
    }
  
    if (!productData.category) {
      toast({
        variant: "destructive",
        description: "Please select a category",
      });
      return;
    }
  
    // Validate variants
    for (const [index, variant] of variants.entries()) {
      if (!variant.color.trim()) {
        toast({
          variant: "destructive",
          description: `Color is required for variant ${index + 1}`,
        });
        return;
      }
  
      if (variant.quantity < 0) {
        toast({
          variant: "destructive",
          description: `Invalid quantity for variant ${index + 1}`,
        });
        return;
      }
  
      if (!variant.price || variant.price <= 0) {
        toast({
          variant: "destructive",
          description: `Invalid price for variant ${index + 1}`,
        });
        return;
      }
  
      if (variant.discountPrice && (variant.discountPrice >= variant.price || variant.discountPrice <= 0)) {
        toast({
          variant: "destructive",
          description: `Invalid discount price for variant ${index + 1}. Must be less than regular price and greater than 0`,
        });
        return;
      }
  
      if (variant.images.length < 3) {
        toast({
          variant: "destructive",
          description: `Each variant must have exactly 3 images. Variant ${index + 1} has ${variant.images.length} images`,
        });
        return;
      }
    }
    
    // Validate all variants have required images
    const hasInvalidVariants = variants.some(variant => variant.images.length < 3);
    if (hasInvalidVariants) {
      toast({
        variant: "destructive",
        description: "Each variant must have at least 3 images",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...productData,
        variants: variants.map(({ color, quantity, price, discountPrice }) => ({
          color,
          quantity,
          price,
          discountPrice
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
    <>
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
                        
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Discount Price
                      </label>
                      <Input
                        type="number"
                        value={variant.discountPrice}
                        onChange={(e) => handleVariantChange(variantIndex, 'discountPrice', e.target.value)}
                        placeholder="Enter discount price"
                      />
                    </div> */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Quantity*
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(variantIndex, 'quantity', e.target.value)}
                        placeholder="Enter quantity"
                        
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

export default AddProductForm;
