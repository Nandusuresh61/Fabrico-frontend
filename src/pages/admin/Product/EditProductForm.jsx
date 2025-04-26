import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { fetchBrands } from '../../../redux/features/brandSlice';
import { getAllCategories } from '../../../redux/features/categorySlice';
import { useToast} from '../../../hooks/use-toast'

const EditProductForm = ({ product, onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const {toast} = useToast();
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.category);
  const [formData, setFormData] = useState({
    color: product.variant.color || '',
    price: product.variant.price || '',
    discountPrice: product.variant.discountPrice || '',
    stock: product.variant.stock || '',
    brand: product.brand._id || '',
    category: product.category._id || '',
    images: []
  });

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(getAllCategories());
  }, [dispatch]);

 

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
    if (!formData.brand) {
      toast({
        variant: "destructive",
        description: "Please select a brand",
      });
      return;
    }

    if (!formData.category) {
      toast({
        variant: "destructive",
        description: "Please select a category",
      });
      return;
    }

    if (!formData.color.trim()) {
      toast({
        variant: "destructive",
        description: "Color is required",
      });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        variant: "destructive",
        description: "Price must be greater than 0",
      });
      return;
    }

    if (formData.discountPrice && (formData.discountPrice >= formData.price || formData.discountPrice <= 0)) {
      toast({
        variant: "destructive",
        description: "Discount price must be less than regular price and greater than 0",
      });
      return;
    }

    if (!formData.stock || formData.stock < 0) {
      toast({
        variant: "destructive",
        description: "Stock must be 0 or greater",
      });
      return;
    }

    
    const totalImages = existingImages.length + formData.images.length;
    if (totalImages === 0) {
      toast({
        variant: "destructive",
        description: "At least one image is required",
      });
      return;
    }

    if (totalImages > 3) {
      toast({
        variant: "destructive",
        description: "Maximum 3 images are allowed",
      });
      return;
    }

    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        if (key === 'discountPrice' && !formData[key]) {
          data.append(key, '');
        } else {
          data.append(key, formData[key]);
        }
      }
    });


    formData.images.forEach(file => {
      data.append('images', file);
    });

    // Append existing images that should be kept
    data.append('existingImages', JSON.stringify(existingImages));

    // Validate that we have at least one image
    if (existingImages.length === 0 && formData.images.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "At least one image is required",
      });
      return;
    }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand*
                </label>
                <Select 
                  value={formData.brand} 
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
                  value={formData.category} 
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
                
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price
              </label>
              <Input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter discount price"
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
