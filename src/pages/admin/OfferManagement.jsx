import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import CustomButton from '../../components/ui/CustomButton';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useToast } from '../../hooks/use-toast';
import Loader from '../../components/layout/Loader';
import { createOfferApi, getAllOffersApi, updateOfferApi, toggleOfferStatusApi } from '../../api/offerApi';
import { getAllProducts } from '../../redux/features/productSlice';
import { getAllCategories } from '../../redux/features/categorySlice';

const OfferManagement = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // States for offers data
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loadingOffers, setLoadingOffers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // States for search, sort, and filter
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortField') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  // Form data state
  const [formData, setFormData] = useState({
    offerName: '',
    offerType: 'product',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    items: '',
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    offerId: null,
    offer: null,
  });

  // Get products and categories from Redux store
  const products = useSelector(state => state.product.products) || [];
  const categories = useSelector(state => state.category.categories) || [];

  // Fetch offers, products, and categories on component mount
  useEffect(() => {
    fetchOffers();
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  // Fetch offers when search params change
  useEffect(() => {
    fetchOffers();
  }, [searchParams]);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: searchParams.get('page') || 1,
        limit: 10,
        search: searchTerm,
        status: selectedStatus,
        sortedField: sortField,
        sortedOrder: sortOrder
      };
      
      const response = await getAllOffersApi(params);
      setOffers(response.data.offers);
      setPagination({
        page: response.data.page,
        totalPages: response.data.pages,
        total: response.data.total
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch offers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUrlAndFetch = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...newParams };

    Object.keys(updatedParams).forEach(key =>
      !updatedParams[key] && delete updatedParams[key]
    );

    setSearchParams(updatedParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateUrlAndFetch({ search: searchTerm, page: 1 });
  };

  const handleSort = (field) => {
    const newSortOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
    updateUrlAndFetch({ sortField: field, sortOrder: newSortOrder, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    updateUrlAndFetch({ status, page: 1 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.offerName || !formData.offerType || !formData.discountPercentage || 
          !formData.startDate || !formData.endDate || !formData.items) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Format dates to ISO string
      const startDate = new Date(formData.startDate).toISOString();
      const endDate = new Date(formData.endDate).toISOString();

      const offerData = {
        offerName: formData.offerName,
        offerType: formData.offerType.toLowerCase(),
        discountPercentage: Number(formData.discountPercentage),
        startDate: startDate,
        endDate: endDate,
        items: [formData.items], // Backend expects an array of item IDs
      };

      console.log('Sending offer data:', offerData); // Debug log

      if (editingOffer) {
        await updateOfferApi(editingOffer._id, offerData);
        toast({
          title: "Success",
          description: "Offer updated successfully",
        });
      } else {
        await createOfferApi(offerData);
        toast({
          title: "Success",
          description: "Offer created successfully",
        });
      }

      handleCloseModal();
      fetchOffers();
    } catch (error) {
      console.error('Error creating/updating offer:', error); // Debug log
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    
    // Format dates for input fields (YYYY-MM-DD format)
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      offerName: offer.offerName,
      offerType: offer.offerType,
      discountPercentage: offer.discountPercentage,
      startDate: formatDateForInput(offer.startDate),
      endDate: formatDateForInput(offer.endDate),
      items: offer.items && offer.items.length > 0 ? offer.items[0] : '', // Handle case where items might be empty
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (offerId) => {
    const offer = offers.find(o => o._id === offerId);
    if (!offer) return;

    setConfirmModal({
      isOpen: true,
      offerId,
      offer,
    });
  };

  const handleConfirmToggle = async () => {
    const { offerId, offer } = confirmModal;
    const action = offer.isActive ? 'deactivate' : 'activate';

    try {
      setLoadingOffers(prev => ({ ...prev, [offerId]: true }));
      await toggleOfferStatusApi(offerId);
      toast({
        title: "Success",
        description: `Offer ${action}d successfully`,
      });
      fetchOffers();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${action} offer`,
        variant: "destructive",
      });
    } finally {
      setLoadingOffers(prev => ({ ...prev, [offerId]: false }));
      setConfirmModal({
        isOpen: false,
        offerId: null,
        offer: null,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
    setFormData({
      offerName: '',
      offerType: 'product',
      discountPercentage: '',
      startDate: '',
      endDate: '',
      items: '',
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offer Management</h1>
        <CustomButton
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          Add New Offer
        </CustomButton>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid gap-4 md:flex md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search offers..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <CustomButton type="submit">Search</CustomButton>
        </form>

        <select
          value={selectedStatus}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Offers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <tr key={offer._id}>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{offer.offerType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{offer.offerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{offer.discountPercentage}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(offer.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(offer.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {offer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(offer._id)}
                        disabled={loadingOffers[offer._id]}
                        className={`${
                          offer.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {loadingOffers[offer._id] ? (
                          <Loader size="sm" />
                        ) : (
                          offer.isActive ? 'Deactivate' : 'Activate'
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    No offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages >= 1 && (
        <div className="flex justify-end mt-4">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateUrlAndFetch({ page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="p-1 rounded-md border"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => updateUrlAndFetch({ page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="p-1 rounded-md border"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="offerName"
                    value={formData.offerName}
                    onChange={handleInputChange}
                    placeholder="Offer Name"
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <select
                    name="offerType"
                    value={formData.offerType}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="product">Product</option>
                    <option value="category">Category</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    placeholder="Discount Percentage"
                    className="w-full border p-2 rounded"
                    min="1"
                    max="100"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <select
                    name="items"
                    value={formData.items || ''}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select {formData.offerType === 'product' ? 'Product' : 'Category'}</option>
                    {formData.offerType === 'product'
                      ? products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))
                      : categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </CustomButton>
                <CustomButton type="submit">
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, offerId: null, offer: null })}
        onConfirm={handleConfirmToggle}
        title={`${confirmModal.offer?.isActive ? 'Deactivate' : 'Activate'} Offer`}
        message={`Are you sure you want to ${
          confirmModal.offer?.isActive ? 'deactivate' : 'activate'
        } this offer?`}
      />
    </div>
  );
};

export default OfferManagement;