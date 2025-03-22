import { useState } from 'react';
import CustomButton from '../../../components/ui/CustomButton';
import { X } from 'lucide-react';

const EditProductNameForm = ({ product, onSubmit, onClose }) => {
  const [productName, setProductName] = useState(product.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: productName });
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
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton type="submit">
              Save Changes
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductNameForm; 