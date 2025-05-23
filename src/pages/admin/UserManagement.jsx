import { useEffect, useState } from 'react';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, toggleUserStatus } from '../../redux/features/adminSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import AdminLayout from '../../components/layout/AdminLayout';
import CustomButton from '../../components/ui/CustomButton';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Loader from '../../components/layout/Loader'

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, loading, error, pagination } = useSelector((state) => state.admin);
  const [togglingUsers, setTogglingUsers] = useState(new Set()); // Track users being toggled
  const [modalState, setModalState] = useState({
    isOpen: false,
    userId: null,
    user: null,
  });

  // Get URL parameters or set defaults
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const sortField = searchParams.get('sortField') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const [searchTerm, setSearchTerm] = useState(search || '');
  // Update URL and fetch data
  const updateParams = (newParams) => {
    const updatedParams = {
      page,
      search,
      status,
      sortField,
      sortOrder,
      ...newParams
    };

    // Remove empty params
    Object.keys(updatedParams).forEach(key =>
      !updatedParams[key] && delete updatedParams[key]
    );

    setSearchParams(updatedParams);

  };
  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchTerm, page: 1 });
  };

  useEffect(() => {
    dispatch(getAllUsers({
      page,
      search,
      status,
      sortField,
      sortOrder
    }));
  }, [dispatch, page, search, status, sortField, sortOrder]);

  const handleSort = (field) => {
    const newSortOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    updateParams({ sortField: field, sortOrder: newSortOrder, page: 1 });
  };

  const toggleStatus = async (userId, user) => {
    if (user.isAdmin) return;

    setModalState({
      isOpen: true,
      userId,
      user,
    });
  };

  const handleConfirmToggle = async () => {
    const { userId, user } = modalState;
    const action = user.status === 'active' ? 'block' : 'unblock';

    try {
      setTogglingUsers(prev => new Set(prev).add(userId));
      await dispatch(toggleUserStatus(userId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setTogglingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      setModalState({ isOpen: false, userId: null, user: null });
    }
  };

  return (
    // <AdminLayout>
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        {/* <CustomButton icon={<UserPlus className="h-4 w-4" />} iconPosition="left">
            Add New User
          </CustomButton> */}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1">
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
        </form>

        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/*  Show loading state */}
      {loading && (
        <div className="col-span-full flex items-center justify-center min-h-[400px]">
          <Loader />
        </div>
      )}

      {/* Show error state */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Show no results message */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No users found{search ? ` for "${search}"` : ''}</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && users.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                  Name {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {!user.isAdmin ? (
                      <button
                        onClick={() => toggleStatus(user._id, user)}
                        disabled={togglingUsers.has(user._id)}
                        className={`text-gray-500 ${user.status === 'active' ? 'hover:text-red-500' : 'hover:text-green-500'
                          } ${togglingUsers.has(user._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {togglingUsers.has(user._id)
                          ? 'Updating...'
                          : user.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                    ) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => updateParams({ page: i + 1 })}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, userId: null, user: null })}
        onConfirm={handleConfirmToggle}
        title="Confirm User Status Change"
        message={
          modalState.user
            ? `Are you sure you want to ${modalState.user.status === 'active' ? 'block' : 'unblock'
            } user "${modalState.user.username}"? ${modalState.user.status === 'active'
              ? 'They will not be able to access the system.'
              : 'They will regain access to the system.'
            }`
            : ''
        }
      />
    </div>
    // </AdminLayout>
  );
};

export default UserManagement;



