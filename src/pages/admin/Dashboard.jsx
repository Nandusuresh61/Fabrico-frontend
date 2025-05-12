import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, ShoppingBag, DollarSign, CreditCard, 
  ArrowUpRight, ArrowDownRight, Package, Tag 
} from 'lucide-react';
import CustomButton from '../../components/ui/CustomButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { getDashboardStats, getSalesData, getTopProducts, getTopCategories, getTopBrands } from '../../api/dashboardapi';
import { useToast } from '../../hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [chartPeriod, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, productsRes, categoriesRes, brandsRes] = await Promise.all([
        getDashboardStats(),
        getTopProducts(),
        getTopCategories(),
        getTopBrands()
      ]);

      setDashboardStats(statsRes.data.stats);
      setTopProducts(productsRes.data.topProducts);
      setTopCategories(categoriesRes.data.topCategories);
      setTopBrands(brandsRes.data.topBrands);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      const params = {
        period: chartPeriod,
        ...dateRange
      };
      const response = await getSalesData(params);
      setSalesData(response.data.salesData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch sales data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-6 py-8">
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <h3 className="text-2xl font-bold">
                ₹{dashboardStats?.totalSales.toLocaleString('en-IN') || 0}
              </h3>
              <div className="mt-1 flex items-center text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>From last month</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold">
                {dashboardStats?.totalOrders || 0}
              </h3>
              <div className="mt-1 flex items-center text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>From last month</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-bold">
                {dashboardStats?.totalCustomers || 0}
              </h3>
              <div className="mt-1 flex items-center text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>From last month</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Refund Count</p>
              <h3 className="text-2xl font-bold">
                {dashboardStats?.refundCount || 0}
              </h3>
              <div className="mt-1 flex items-center text-sm text-red-600">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                <span>From last month</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>


      {/* Sales Chart with Period Filter */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
          <div className="flex items-center gap-3">
            <Select value={chartPeriod} onValueChange={setChartPeriod}>
              <SelectTrigger className="w-32 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="rounded-md border border-gray-200 px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="rounded-md border border-gray-200 px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                horizontal={true} 
                vertical={false} 
              />
              <XAxis 
                dataKey="_id" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                contentStyle={{
                  background: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="sales" 
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Top Products */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  <span className="font-medium">{product.productDetails.name}</span>
                </div>
                {/* <span className="text-sm text-gray-600">{product.totalQuantity} sold</span> */}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Top Categories</h2>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  <span className="font-medium">{category.categoryDetails.name}</span>
                </div>
                {/* <span className="text-sm text-gray-600">₹{category.totalSales.toFixed(2)}</span> */}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Top Brands</h2>
          <div className="space-y-4">
            {topBrands.map((brand, index) => (
              <div key={brand._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  <span className="font-medium">{brand.brandDetails.name}</span>
                </div>
                {/* <span className="text-sm text-gray-600">₹{brand.totalSales.toFixed(2)}</span> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      
    </div>
  );
};

export default Dashboard;