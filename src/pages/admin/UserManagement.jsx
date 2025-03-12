
import { useState } from 'react';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import CustomButton from '../..//components/ui/CustomButton';

// Mock user data
const users = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', joinDate: '2023-05-10', status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', joinDate: '2023-06-15', status: 'Active' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', joinDate: '2023-07-20', status: 'Inactive' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', joinDate: '2023-07-25', status: 'Active' },
  { id: 5, name: 'Robert Wilson', email: 'robert.wilson@example.com', joinDate: '2023-08-01', status: 'Active' },
  { id: 6, name: 'Jennifer Garcia', email: 'jennifer.garcia@example.com', joinDate: '2023-08-05', status: 'Active' },
  { id: 7, name: 'William Martinez', email: 'william.martinez@example.com', joinDate: '2023-08-10', status: 'Inactive' },
  { id: 8, name: 'Elizabeth Anderson', email: 'elizabeth.anderson@example.com', joinDate: '2023-08-15', status: 'Active' },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <CustomButton icon={<UserPlus className="h-4 w-4" />} iconPosition="left">
            Add New User
          </CustomButton>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Join Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    #{user.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {user.joinDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">8</span> users
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-sm disabled:opacity-50">
              &lt;
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm text-white">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-sm disabled:opacity-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
