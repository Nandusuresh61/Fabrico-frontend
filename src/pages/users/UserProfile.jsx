import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import UserProfileSidebar from './Profile/UserProfileSideBar';
import PersonalInformation from './Profile/PersonalInformation';
import AddressSection from './Profile/AddressSection';
// import WalletSection from '@/components/profile/WalletSection';
// import CouponsSection from '@/components/profile/CouponsSection';
import PasswordChange from './Profile/PasswordChange';
import UserLogout from './Profile/UserLogout';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Orders from './Profile/Orders';
import Wallet from './Profile/Wallet';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInformation />;
      case 'address':
        return <AddressSection />;
      case 'orders':
        return <Orders />;
      case 'wallet':
        return <Wallet />;
      // case 'coupons':
      //   return <CouponsSection />;
      case 'password':
        return <PasswordChange />;
      case 'logout':
        return <UserLogout />;
      default:
        return <PersonalInformation />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:px-6">
        <h1 className="mb-8 text-2xl font-bold md:text-3xl">My Account</h1>
        
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Mobile Tab Selector */}
          {isMobile && (
            <div className="w-full overflow-x-auto">
              <div className="flex gap-2 pb-2">
                <UserProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} isMobile={isMobile} />
              </div>
            </div>
          )}
          
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="w-full md:w-1/4 lg:w-1/5">
              <UserProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} isMobile={isMobile} />
            </div>
          )}
          
          {/* Content Panel */}
          <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:w-3/4 lg:w-4/5">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
