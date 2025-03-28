import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/features/userSlice';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsUserMenuOpen(false);
  };

  // Add this useEffect after your other useEffects
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-white'
      )}
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center text-2xl font-semibold transition-opacity hover:opacity-80"
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
              className={`text-lg font-medium text-gray-700 transition-colors hover:text-primary ${
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
        <div className="hidden items-center space-x-6 md:flex">
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
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="View your wishlist"
          >
            <Heart className="h-6 w-6" />
          </Link>

          {/* User Icon */}
          <div className="relative user-menu">
            {user ? (
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <div className="flex items-center gap-2">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="h-12 w-12 rounded-full" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex h-12 items-center justify-center rounded-full bg-gray-100 px-6 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <span className="text-base font-medium">Login</span>
              </Link>
            )}

            {/* Dropdown Menu - Only show if user is logged in */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-52 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              0
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Wishlist Icon (Mobile) */}
          <Link 
            to="/wishlist" 
            className="flex h-12 w-12 items-center justify-center text-gray-700"
            aria-label="View your wishlist"
          >
            <Heart className="h-6 w-6" />
          </Link>
          
          <Link 
            to="/cart" 
            className="relative flex h-12 w-12 items-center justify-center text-gray-700"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
              0
            </span>
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-12 w-12 items-center justify-center text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-white animate-fade-in md:hidden">
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
                  className={`flex items-center py-2 text-xl font-medium ${
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
              
              <Link to="/wishlist" className="flex items-center py-2 text-xl font-medium text-gray-800">
                <Heart className="mr-3 h-6 w-6" />
                Wishlist
              </Link>
              
              <Link to="/login" className="flex items-center py-2 text-xl font-medium text-gray-800">
                <User className="mr-3 h-6 w-6" />
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
