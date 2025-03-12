import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, hideHeader = false, hideFooter = false }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!hideHeader && <Header />}
      <main className="flex-1">
        {/* Padding for header height */}
        {!hideHeader && <div className="h-16"></div>}
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;