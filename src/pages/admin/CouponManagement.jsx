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

  // States for coupons data
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

  // States for search and filter
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );

  // Form data state
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumAmount: "",
    startDate: "",
    endDate: "",
  });

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page,
        search: searchTerm,
        status: selectedStatus,
        limit: 10,
        searchFields: ['couponCode', 'discountType']
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
  }, [pagination.page, searchParams.get('search'), selectedStatus]);

  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedStatus) params.set("status", selectedStatus);
    if (pagination.page > 1) params.set("page", pagination.page);
    setSearchParams(params);
  }, [ selectedStatus, pagination.page]);

  // Generate random coupon code
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (
        !formData.code ||
        !formData.discountType ||
        !formData.discountValue ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.minimumAmount
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate discount value
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
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumAmount: Number(formData.minimumAmount),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
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
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumAmount: coupon.minOrderAmount,
      startDate: new Date(coupon.startDate).toISOString().split("T")[0],
      endDate: new Date(coupon.endDate).toISOString().split("T")[0],
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
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', 1);
    setSearchParams(params);
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
                {coupons.map((coupon) => (
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
                ))}
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
                { pagination.page }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Coupon Code"
                    className="flex-1 border p-2 rounded"
                    required
                    disabled={editingCoupon}
                  />
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
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
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
                    className="w-full border p-2 rounded"
                    min="0"
                    max={formData.discountType === "percentage" ? "100" : ""}
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="minimumAmount"
                    value={formData.minimumAmount}
                    onChange={handleInputChange}
                    placeholder="Minimum Order Amount"
                    className="w-full border p-2 rounded"
                    min="0"
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
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
