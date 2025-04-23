import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import {
  getAllTransactionsApi,
  getTransactionByIdApi,
} from "../../api/TransactionApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";

const TransactionManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Search and filter states
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";
  const sortField = searchParams.get("sortField") || "date";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  useEffect(() => {
    fetchTransactions();
  }, [searchParams]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllTransactionsApi({
        page: currentPage,
        search: searchTerm,
        type: typeFilter,
        sortField,
        sortOrder,
      });
      setTransactions(response.data.transactions);
      setPagination(response.data.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (transactionId) => {
    try {
      const response = await getTransactionByIdApi(transactionId);
      setSelectedTransaction(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transaction details",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: 1 });
  };
  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };
  const handleTypeFilter = (value) => {
    updateParams({ type: value, page: 1 });
  };

  const handleSort = (field) => {
    updateParams({
      sortField: field,
      sortOrder: field === sortField && sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const updateParams = (newParams) => {
    const current = Object.fromEntries([...searchParams]);
    setSearchParams({ ...current, ...newParams });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search transactions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <Select value={typeFilter} onValueChange={handleTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="debit">Debit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Transaction ID <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
            transactions.map((item) => (
              <TableRow key={item.transactionId}>
                <TableCell>{item.transactionId}</TableCell>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>{item.user.username || "N/A"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.type === "credit"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.type}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(item.amount)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item.transactionId)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}


      {/* Transaction Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500">User Details</h4>
                  <p>{selectedTransaction.user.username}</p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.user.email}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Transaction ID</h4>
                  <p>{selectedTransaction.transaction.id}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Date</h4>
                  <p>{formatDate(selectedTransaction.transaction.date)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Type</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedTransaction.transaction.type === "credit"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedTransaction.transaction.type}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Amount</h4>
                  <p>
                    {formatCurrency(selectedTransaction.transaction.amount)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Status</h4>
                  <p>{selectedTransaction.transaction.status}</p>
                </div>
              </div>

              {selectedTransaction.transaction.orderId && (
                <div>
                  <h4 className="font-medium text-gray-500">Order Details</h4>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/admin/orders/${selectedTransaction.transaction.orderId}`
                      )
                    }
                  >
                    View Order Details
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionManagement;
