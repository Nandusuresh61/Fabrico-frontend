import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import CustomButton from "../../components/ui/CustomButton";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { useToast } from "../../hooks/use-toast";
import Loader from "../../components/layout/Loader";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
} from "../../api/couponApi";

const CouponManagement = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    couponId: null,
    isExpired: false,
  });

  const [errors, setErrors] = useState({});
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    totalPages: 1,
    total: 0,
  });

  
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumAmount: "",
    maximumAmount: "",
    startDate: "",
    endDate: "",
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        search: searchTerm,
        status: selectedStatus,
        limit: 10,
        searchFields: ["couponCode", "discountType"],
      };

      const response = await getAllCoupons(params);
      setCoupons(response.data.coupons);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch coupons",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [pagination.page, searchParams.get("search"), selectedStatus]);


  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedStatus) params.set("status", selectedStatus);
    if (pagination.page > 1) params.set("page", pagination.page);
    setSearchParams(params);
  }, [selectedStatus, pagination.page]);


  const generateCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setFormData((prev) => ({ ...prev, code: result }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (
        !formData.code ||
        !formData.description ||
        !formData.discountType ||
        !formData.discountValue ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.minimumAmount ||
        !formData.maximumAmount
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }


      if (
        formData.discountType === "percentage" &&
        (formData.discountValue < 0 || formData.discountValue > 100)
      ) {
        toast({
          title: "Error",
          description: "Percentage discount must be between 0 and 100",
          variant: "destructive",
        });
        return;
      }

      const couponData = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumAmount: Number(formData.minimumAmount),
        maximumAmount: Number(formData.maximumAmount),
        startDate: new Date(formData.startDate + 'T00:00:00.000Z').toISOString(),
        endDate: new Date(formData.endDate + 'T00:00:00.000Z').toISOString(),
      };

      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, couponData);
      } else {
        await createCoupon(couponData);
      }

      toast({
        title: "Success",
        description: editingCoupon
          ? "Coupon updated successfully"
          : "Coupon created successfully",
      });

      handleCloseModal();
      fetchCoupons();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save coupon",
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.couponCode,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumAmount: coupon.minOrderAmount,
      maximumAmount: coupon.maxOrderAmount,
      startDate: new Date(new Date(coupon.startDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0],
    endDate: new Date(new Date(coupon.endDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0],
  });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (couponId) => {
    try {
      setLoadingCoupons((prev) => ({ ...prev, [couponId]: true }));
      await toggleCouponStatus(couponId);
      fetchCoupons();
      setConfirmationModal({
        isOpen: false,
        couponId: null,
        isExpired: false,
      });
      toast({
        title: "Success",
        description: "Coupon status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update coupon status",
        variant: "destructive",
      });
    } finally {
      setLoadingCoupons((prev) => ({ ...prev, [couponId]: false }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minimumAmount: "",
      startDate: "",
      endDate: "",
    });
  };
  const openConfirmationModal = (couponId, isExpired) => {
    setConfirmationModal({
      isOpen: true,
      couponId,
      isExpired,
    });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", 1);
    setSearchParams(params);
  };

  // validation function is here

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code) {
      newErrors.code = 'Coupon code is required';
    } else if (!/^[A-Z0-9]{6,12}$/.test(formData.code.toUpperCase())) {
      newErrors.code = 'Code must be 6-12 characters long and contain only letters and numbers';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10 || formData.description.length > 200) {
      newErrors.description = 'Description must be between 10 and 200 characters';
    }

    if (!formData.discountType) {
      newErrors.discountType = 'Discount type is required';
    }

    if (!formData.discountValue) {
      newErrors.discountValue = 'Discount value is required';
    } else if (formData.discountType === 'percentage') {
      if (formData.discountValue <= 0 || formData.discountValue >= 100) {
        newErrors.discountValue = 'Percentage must be between 0 and 100';
      }
    } else if (formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount amount must be greater than 0';
    }


    if (!formData.minimumAmount) {
      newErrors.minimumAmount = 'Minimum amount is required';
    } else if (formData.minimumAmount <= 0) {
      newErrors.minimumAmount = 'Minimum amount cannot be negative or zero';
    } else if (formData.discountType === 'fixed' && 
               parseFloat(formData.discountValue) >= parseFloat(formData.minimumAmount)) {
      newErrors.discountValue = 'Fixed discount must be less than minimum amount';
    }

    if (!formData.maximumAmount) {
      newErrors.maximumAmount = 'Maximum amount is required';
    } else if (parseFloat(formData.maximumAmount) <= parseFloat(formData.minimumAmount)) {
      newErrors.maximumAmount = 'Maximum amount must be greater than minimum amount';
    }



    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const start = new Date(formData.startDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (start < now) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
      

      const maxDuration = 365 * 24 * 60 * 60 * 1000;
      if (end - start > maxDuration) {
        newErrors.endDate = 'Coupon duration cannot exceed 1 year';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <CustomButton
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          Add New Coupon
        </CustomButton>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search coupons..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <CustomButton type="submit">Search</CustomButton>
        </form>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Coupons Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No coupons found
                    </td>
                  </tr>
                ) : (coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.couponCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {coupon.discountType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{coupon.minOrderAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          coupon.isExpired
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {coupon.isExpired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            openConfirmationModal(coupon._id, coupon.isExpired)
                          }
                          disabled={loadingCoupons[coupon._id]}
                          className={`text-gray-500 ${
                            coupon.isExpired
                              ? "hover:text-green-500"
                              : "hover:text-red-500"
                          } ${
                            loadingCoupons[coupon._id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {loadingCoupons[coupon._id]
                            ? "Updating..."
                            : coupon.isExpired
                            ? "Activate"
                            : "Deactivate"}
                        </button>
                        <ConfirmationModal
                          isOpen={confirmationModal.isOpen}
                          onClose={() =>
                            setConfirmationModal({
                              isOpen: false,
                              couponId: null,
                              isExpired: false,
                            })
                          }
                          onConfirm={() =>
                            handleToggleStatus(confirmationModal.couponId)
                          }
                          title="Confirm Status Change"
                          message={`Are you sure you want to ${
                            confirmationModal.isExpired
                              ? "activate"
                              : "deactivate"
                          } this coupon?`}
                        />
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages >= 1 && (
            <div className="flex justify-end items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  icon={<ChevronLeft className="h-4 w-4" />}
                />
                {pagination.page}
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  icon={<ChevronRight className="h-4 w-4" />}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto p-4">
    <div className="relative bg-white rounded-lg w-[500px] max-h-[90vh] flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">
          {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
        </h2>
      </div>
      
      <div className="p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Coupon Code"
                className={`w-full border p-2 rounded ${
                  errors.code ? 'border-red-500' : ''
                }`}
                disabled={editingCoupon}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>
            {!editingCoupon && (
              <CustomButton
                type="button"
                onClick={generateCouponCode}
                variant="outline"
              >
                Generate
              </CustomButton>
            )}
          </div>

          <div>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              className={`w-full border p-2 rounded ${
                errors.discountType ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select Discount Type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            {errors.discountType && (
              <p className="text-red-500 text-sm mt-1">{errors.discountType}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              placeholder={`Discount ${
                formData.discountType === "percentage"
                  ? "Percentage"
                  : "Amount"
              }`}
              className={`w-full border p-2 rounded ${
                errors.discountValue ? 'border-red-500' : ''
              }`}
              min="0"
              max={formData.discountType === "percentage" ? "100" : ""}
            />
            {errors.discountValue && (
              <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="minimumAmount"
              value={formData.minimumAmount}
              onChange={handleInputChange}
              placeholder="Minimum Order Amount"
              className={`w-full border p-2 rounded ${
                errors.minimumAmount ? 'border-red-500' : ''
              }`}
              min="0"
            />
            {errors.minimumAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.minimumAmount}</p>
            )}
          </div>


          <div>
  <input
    type="number"
    name="maximumAmount"
    value={formData.maximumAmount}
    onChange={handleInputChange}
    placeholder="Maximum Order Amount"
    className={`w-full border p-2 rounded ${errors.maximumAmount ? 'border-red-500' : ''}`}
    min={formData.minimumAmount || 0}
  />
  {errors.maximumAmount && (
    <p className="text-red-500 text-sm mt-1">{errors.maximumAmount}</p>
  )}
</div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Coupon Description"
              className={`w-full border p-2 rounded ${
                errors.description ? 'border-red-500' : ''
              }`}
              rows="3"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${
                  errors.startDate ? 'border-red-500' : ''
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded ${
                  errors.endDate ? 'border-red-500' : ''
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t bg-gray-50">
        <div className="flex justify-end gap-2">
          <CustomButton
            type="button"
            variant="outline"
            onClick={handleCloseModal}
          >
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSubmit}>
            {editingCoupon ? "Update Coupon" : "Create Coupon"}
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CouponManagement;
