import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, ShoppingBag, DollarSign, CreditCard, 
  ArrowUpRight, ArrowDownRight, Package, Tag 
} from 'lucide-react';
// import AdminLayout from '../../components/layout/AdminLayout';
import CustomButton from '../../components/ui/CustomButton';

// Mock data for the dashboard
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Smith', date: '2023-08-10', status: 'Delivered', amount: 59.99 },
  { id: '#ORD-002', customer: 'Sarah Johnson', date: '2023-08-09', status: 'Processing', amount: 129.99 },
  { id: '#ORD-003', customer: 'Michael Brown', date: '2023-08-08', status: 'Shipped', amount: 89.99 },
  { id: '#ORD-004', customer: 'Emily Davis', date: '2023-08-07', status: 'Delivered', amount: 44.99 },
  { id: '#ORD-005', customer: 'David Wilson', date: '2023-08-06', status: 'Delivered', amount: 74.99 },
];

const Dashboard = () => {
  return (
    // <AdminLayout>
      <div className="px-6 py-8">
        <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <h3 className="text-2xl font-bold">$24,780</h3>
                <div className="mt-1 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>12% from last month</span>
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
                <h3 className="text-2xl font-bold">384</h3>
                <div className="mt-1 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>8% from last month</span>
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
                <h3 className="text-2xl font-bold">1,269</h3>
                <div className="mt-1 flex items-center text-sm text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>5% from last month</span>
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
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <h3 className="text-2xl font-bold">$64.52</h3>
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  <span>3% from last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Sales Chart */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Sales Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Bar dataKey="sales" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <CustomButton variant="outline" size="sm">View All</CustomButton>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">{order.date}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">${order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    // </AdminLayout>
  );
};

export default Dashboard;
