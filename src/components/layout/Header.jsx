import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Navigation options with proper category values
  const navOptions = [
    { name: 'Shop', path: '/products' },
    { name: 'Men', category: 'men' },
    { name: 'Women', category: 'women' },
    { name: 'Kids', category: 'kids' },
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

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     // Preserve existing params and add/update search
  //     const currentParams = Object.fromEntries(searchParams.entries());
  //     navigate({
  //       pathname: '/products',
  //       search: new URLSearchParams({
  //         ...currentParams,
  //         search: searchQuery.trim(),
  //         page: '1' // Reset to first page on new search
  //       }).toString()
  //     });
  //   }
  // };

  const handleNavigation = (option) => {
    if (option.path) {
      // For "Shop", just go to products page with default params
      navigate(option.path);
    } else if (option.category) {
      // For category navigation, preserve other params except category
      const currentParams = Object.fromEntries(searchParams.entries());
      navigate({
        pathname: '/products',
        search: new URLSearchParams({
          ...currentParams,
          category: option.category,
          page: '1' // Reset to first page on category change
        }).toString()
      });
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
        <nav className="hidden items-center space-x-8 md:flex">
          {navOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => handleNavigation(option)}
              className={`text-base font-medium text-gray-700 transition-colors hover:text-primary ${
                (option.category && searchParams.get('category') === option.category) ||
                (!option.category && location.pathname === option.path)
                  ? 'text-primary'
                  : ''
              }`}
            >
              {option.name}
            </button>
          ))}
        </nav>

        {/* Search, User, and Cart - Desktop */}
        <div className="hidden items-center space-x-4 md:flex">
          {/* Search Bar */}
          {/* <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-full border-none bg-gray-100 py-2 pl-10 pr-4 text-sm transition-all focus:bg-gray-200 focus:outline-none focus:ring-0"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </form> */}

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
            <nav className="flex flex-col space-y-6">
              {navOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleNavigation(option)}
                  className={`flex items-center py-2 text-lg font-medium ${
                    (option.category && searchParams.get('category') === option.category) ||
                    (!option.category && location.pathname === option.path)
                      ? 'text-primary'
                      : 'text-gray-800'
                  }`}
                >
                  {option.name}
                </button>
              ))}
              
              <div className="my-4 h-px bg-gray-200" />
              
              <Link to="/wishlist" className="flex items-center py-2 text-lg font-medium text-gray-800">
                <Heart className="mr-3 h-5 w-5" />
                Wishlist
              </Link>
              
              <Link to="/login" className="flex items-center py-2 text-lg font-medium text-gray-800">
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
