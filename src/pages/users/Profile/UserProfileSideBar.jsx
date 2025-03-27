import { User, MapPin, ShoppingBag, Wallet, Tag, KeyRound, LogOut } from 'lucide-react';

const UserProfileSidebar = ({ activeTab, onTabChange, isMobile }) => {
  const menuItems = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    // { id: 'wallet', label: 'Wallet', icon: Wallet },
    // { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'password', label: 'Password Change', icon: KeyRound },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ];

  if (isMobile) {
    return (
      <>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex min-w-max items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </>
    );
  }

  return (
    <div className="sticky top-20 rounded-lg border border-gray-200 bg-white shadow-sm">
      <nav className="flex flex-col p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default UserProfileSidebar;
