import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Categories for the menu
  const categories = [
    { name: 'New Arrivals', path: '/products?category=new-arrivals' },
    { name: 'Bestsellers', path: '/products?category=bestsellers' },
    { name: 'Baseball Caps', path: '/products?category=baseball-caps' },
    { name: 'Trucker Caps', path: '/products?category=trucker-caps' },
    { name: 'Snapback', path: '/products?category=snapback' },
    { name: 'Fitted Caps', path: '/products?category=fitted-caps' },
    { name: 'Dad Hats', path: '/products?category=dad-hats' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-white'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center text-xl font-semibold transition-opacity hover:opacity-80"
        >
          <span className="mr-1 text-primary">FAB</span>
          <span className="text-gray-500">RICO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Search, User, and Cart - Desktop */}
        <div className="hidden items-center space-x-4 md:flex">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-full border-none bg-gray-100 py-2 pl-10 pr-4 text-sm transition-all focus:bg-gray-200 focus:outline-none focus:ring-0"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </form>

          {/* Wishlist Icon */}
          <Link 
            to="/wishlist" 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="View your wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* User Icon */}
          <Link 
            to="/login" 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
              0
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Wishlist Icon (Mobile) */}
          <Link 
            to="/wishlist" 
            className="flex h-10 w-10 items-center justify-center text-gray-700"
            aria-label="View your wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>
          
          <Link 
            to="/cart" 
            className="relative flex h-10 w-10 items-center justify-center text-gray-700"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
              0
            </span>
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white animate-fade-in md:hidden">
          <div className="container px-4 py-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-none bg-gray-100 py-3 pl-10 pr-4 text-sm"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="flex items-center py-2 text-base font-medium text-gray-800"
                >
                  {category.name}
                </Link>
              ))}
              
              <div className="my-2 h-px bg-gray-200" />
              
              <Link to="/wishlist" className="flex items-center py-2 text-base font-medium text-gray-800">
                <Heart className="mr-3 h-5 w-5" />
                Wishlist
              </Link>
              
              <Link to="/login" className="flex items-center py-2 text-base font-medium text-gray-800">
                <User className="mr-3 h-5 w-5" />
                Account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
