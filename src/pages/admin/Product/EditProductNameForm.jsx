import { useState } from 'react';
import CustomButton from '../../../components/ui/CustomButton';
import { X } from 'lucide-react';

const EditProductNameForm = ({ product, onSubmit, onClose }) => {
  const [productName, setProductName] = useState(product.name);
  const [error, setError] = useState('');

  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Product name is required';
    }
    const specialCharsOnly = /^[^a-zA-Z0-9]+$/.test(name.trim());
    const underscoresOnly = /^[_]+$/.test(name.trim());
    
    if (specialCharsOnly || underscoresOnly) {
      return 'Product name must contain at least one letter';
    }
    if (name.trim().length < 3) {
      return 'Product name must be at least 3 characters';
    }
    if (name.trim().length > 100) {
      return 'Product name cannot exceed 100 characters';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateName(productName);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit({ name: productName.trim() });
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setProductName(newName);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Product Name</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={handleNameChange}
              className={`w-full rounded-md border ${
                error ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2`}
              placeholder="Enter product name"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton 
              type="submit"
              disabled={!!error}
            >
              Save Changes
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductNameForm;