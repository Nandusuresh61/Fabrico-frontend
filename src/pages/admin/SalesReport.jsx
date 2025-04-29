import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, FileSpreadsheet, FileText, Filter, Search } from 'lucide-react';
import CustomButton from '../../components/ui/CustomButton';
import { useToast } from '../../hooks/use-toast';
import Loader from '../../components/layout/Loader';
import { generateSalesReportApi, downloadReportApi } from '../../api/reportApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const SalesReport = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // States for report data
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('daily');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Summary metrics
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalDiscount: 0,
    couponDiscount: 0,
    productDiscount: 0,
    totalUnits: 0,
    averageOrderValue: 0,
    paymentMethods: {
      cod: 0,
      online: 0,
      wallet: 0
    }
  });

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Function to get date range
  const getDateRange = () => {
    const today = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'daily':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'weekly':
        startDate = new Date(today.setDate(today.getDate() - 7));
        endDate = new Date();
        break;
      case 'monthly':
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        endDate = new Date();
        break;
      case 'yearly':
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        endDate = new Date();
        break;
      case 'custom':
        startDate = new Date(customRange.startDate);
        endDate = new Date(customRange.endDate);
        break;
      default:
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
    }

    return { startDate, endDate };
  };

  // Function to generate report
  const generateReport = async () => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getDateRange();

      const response = await generateSalesReportApi({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      setReportData(response.data.orders);
      setSummary(response.data.summary);

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download report
  const downloadReport = async (format) => {
    try {
      if (!reportData) {
        toast({
          title: "Error",
          description: "Please generate a report first",
          variant: "destructive",
        });
        return;
      }
      setIsLoading(true);
      const { startDate, endDate } = getDateRange();
      
      
      const response = await downloadReportApi(format, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format
      });
      

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type: format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });

      const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-report-${format}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);


    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to download report",
        variant: "destructive",
      });
    }finally{
      setIsLoading(false);
    }
  };

  // Generate report when date range changes
  useEffect(() => {
    if (dateRange !== 'custom' || (customRange.startDate && customRange.endDate)) {
      generateReport();
    }
  }, [dateRange, customRange]);
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales Report</h1>
          <p className="text-gray-500">View and analyze your sales data</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Report Filters</CardTitle>
          <CardDescription>Select date range to generate report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === 'custom' && (
              <div className="flex gap-4">
                <input
                  type="date"
                  value={customRange.startDate}
                  onChange={(e) => setCustomRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border rounded-md px-3 py-2"
                />
                <input
                  type="date"
                  value={customRange.endDate}
                  onChange={(e) => setCustomRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border rounded-md px-3 py-2"
                />
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <CustomButton
                variant="outline"
                onClick={() => downloadReport('excel')}
                icon={<FileSpreadsheet className="h-4 w-4" />}
              >
                Excel
              </CustomButton>
              <CustomButton
                variant="outline"
                onClick={() => downloadReport('pdf')}
                icon={<FileText className="h-4 w-4" />}
              >
                PDF
              </CustomButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.totalSales)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Avg. {formatCurrency(summary.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.totalUnits}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency((summary?.productDiscount || 0) + (summary?.couponDiscount || 0))}
            </p>
            <div className="text-sm text-gray-500 mt-1">
              <p>Product: {formatCurrency(summary?.productDiscount || 0)}</p>
              <p>Coupon: {formatCurrency(summary?.couponDiscount || 0)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(summary.paymentMethods).map(([method, count]) => (
              <div key={method} className="text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-gray-500 capitalize">{method}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Report</CardTitle>
          <CardDescription>List of all orders in selected date range</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : reportData && reportData.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Dis</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon Dis</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(order.productDiscount || order.items.reduce((sum, item) => {
            return sum + ((item.originalPrice - item.price) * item.quantity);
        }, 0) || 0)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(order.couponDiscount || 0)}
    </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div className="flex justify-between items-center mt-4 px-6">
                <div className="text-sm text-gray-500">
                  Showing {Math.min(currentPage * itemsPerPage, reportData.length)} of {reportData.length} entries
                </div>
                <div className="flex gap-2">
                  <CustomButton
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </CustomButton>
                  <CustomButton
                    variant="outline"
                    onClick={() => setCurrentPage(prev => 
                      Math.min(prev + 1, Math.ceil(reportData.length / itemsPerPage))
                    )}
                    disabled={currentPage >= Math.ceil(reportData.length / itemsPerPage)}
                  >
                    Next
                  </CustomButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found in selected date range
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReport;