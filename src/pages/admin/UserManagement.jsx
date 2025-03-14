import { useEffect, useState } from 'react';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, toggleUserStatus } from '../../redux/features/adminSlice';
// import AdminLayout from '../../components/layout/AdminLayout';
import CustomButton from '../../components/ui/CustomButton';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  //  Fetch users when the component loads
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  //  Filter users by search and status
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  //  Pagination logic
  const totalPages = Math.ceil(users.length / usersPerPage);


  //toggle status
  const toggleStatus = (userId,user) =>{
    if(user.isAdmin){
      return;
    }
    dispatch(toggleUserStatus(userId));
  }

  return (
    // <AdminLayout>
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
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/*  Show loading state */}
        {loading && <p className="text-center text-gray-500">Loading users...</p>}

        {/*  Show error state */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/*  Users Table */}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{user._id}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                    <span 
                    onClick={()=>toggleStatus(user._id, user)}
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <Edit className="cursor-pointer text-gray-500" />
                      <Trash2 className="cursor-pointer text-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/*  Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    // </AdminLayout>
  );
};

export default UserManagement;



