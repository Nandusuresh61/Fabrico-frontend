import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { 
  LayoutDashboard, Users, ShoppingBag, Tags, 
  BadgePercent, Settings, LogOut, Menu, X ,
  ShoppingCart, Ticket, Award, BarChart3,
  Receipt
} from 'lucide-react';
import { logoutAdmin } from '../../redux/features/adminSlice';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  
  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, name: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="h-5 w-5" />, name: 'Users', path: '/admin/users' },
    { icon: <ShoppingBag className="h-5 w-5" />, name: 'Products', path: '/admin/products' },
    { icon: <Tags className="h-5 w-5" />, name: 'Categories', path: '/admin/categories' },
    { icon: <Award className="h-5 w-5" />, name: 'Brands', path: '/admin/brands' },
    { icon: <ShoppingCart className="h-5 w-5" />, name: 'Orders', path: '/admin/orders' },
    { icon: <BadgePercent className="h-5 w-5" />, name: 'Offers', path: '/admin/offers' },
    { icon: <Ticket className="h-5 w-5" />, name: 'Coupons', path: '/admin/coupons' },
    { icon: <BarChart3 className="h-5 w-5" />, name: 'Sales Report', path: '/admin/sales' },
    { icon: <Receipt className="h-5 w-5" />, name: 'Transactions', path: '/admin/transactions' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleLogout = () =>{
    dispatch(logoutAdmin());
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold">Fabrico Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-gray-200 pt-4">
            <div
              
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <button onClick={handleLogout} className="ml-3">Logout</button>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={toggleSidebar}
      ></div>
      
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <h1 className="text-xl font-bold">Caps Admin</h1>
          <button onClick={toggleSidebar} className="rounded-md p-1 hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleSidebar}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-gray-200 pt-4">
            <div
              
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <button onClick={handleLogout} className="ml-3">Logout</button>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <span className="text-sm font-medium">A</span>
            </div>
          </div> */}
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
