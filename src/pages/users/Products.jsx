import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/ui/ProductCard';
import { getAllProductsForUsers } from '../../redux/features/productSlice';
import { getAllCategories } from '../../redux/features/categorySlice';
import { fetchBrands } from '../../redux/features/brandSlice';
import Loader from '../../components/layout/Loader';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, totalPages, currentPage } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brands);

  // Get all params from URL
  const categoryFromUrl = searchParams.get('category') || 'all';
  const searchFromUrl = searchParams.get('search') || '';
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const sortFromUrl = searchParams.get('sort') || 'featured';
  const brandFromUrl = searchParams.get('brand') || 'all';
  const minPriceFromUrl = parseInt(searchParams.get('minPrice')) || 0;
  const maxPriceFromUrl = parseInt(searchParams.get('maxPrice')) || 1000;

  // Local state for filters
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [activeBrand, setActiveBrand] = useState(brandFromUrl);
  const [priceRange, setPriceRange] = useState([minPriceFromUrl, maxPriceFromUrl]);
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  // Update URL and fetch products
  const updateFilters = (newFilters) => {
    const currentFilters = {
      category: activeCategory,
      brand: activeBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortBy,
      search: searchTerm,
      page: pageFromUrl,
      ...newFilters
    };

    const cleanFilters = {};
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (
        value !== 'all' && 
        value !== '' && 
        value !== 0 && 
        !(key === 'maxPrice' && value === 1000) &&
        !(key === 'page' && value === 1) &&
        !(key === 'sort' && value === 'featured')
      ) {
        cleanFilters[key] = value;
      }
    });

    setSearchParams(cleanFilters);
  };

  const handleApplyFilters = () => {
    updateFilters({ page: 1 });
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setActiveBrand('all');
    setPriceRange([0, 1000]);
    setSortBy('featured');
    setSearchTerm('');
    setSearchParams({});
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setActiveCategory('all');
      setActiveBrand('all');
      updateFilters({ 
        search: '',
        category: 'all',
        brand: 'all',
        page: 1 
      });
      return;
    }

    const matchedCategory = categories.filter(category => category.status == "Activated").find(
      category => category.name.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
    );

    const matchedBrand = brands.filter(brand => brand.status == 'Activated').find(
      brand => brand.name.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
    );

    if (matchedCategory) {
  
      setActiveCategory(matchedCategory.name.toLowerCase());
      updateFilters({ 
        category: matchedCategory.name.toLowerCase(),
        brand: 'all',
        search: '',
        page: 1 
      });
    } else if (matchedBrand) {
     
      setActiveBrand(matchedBrand._id);
      updateFilters({ 
        brand: matchedBrand._id,
        category: 'all', 
        search: '',
        page: 1 
      });
    } else {
     
      setActiveCategory('all');
      setActiveBrand('all');
      updateFilters({ 
        search: trimmedSearchTerm,
        category: 'all',
        brand: 'all',
        page: 1 
      });
    }
  };

  // Fetch products when URL params change
  useEffect(() => {
    dispatch(getAllProductsForUsers({
      category: categoryFromUrl,
      brand: brandFromUrl,
      minPrice: minPriceFromUrl,
      maxPrice: maxPriceFromUrl,
      sort: sortFromUrl,
      search: searchFromUrl,
      page: pageFromUrl,
      status: 'active',
      limit: 6
    }));
  }, [dispatch, searchParams]);

  // Fetch categories and brands
  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  return (
    <Layout>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        {/* Search Bar - Updated to remove form and button */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search products, categories, or brands..."
              className="w-full rounded-lg border p-2"
            />
          </form>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="space-y-6 md:col-span-1">
            {/* Category Filter */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`block w-full text-left text-sm ${
                    activeCategory === 'all' ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Categories
                </button>
                {categories.filter(category => category.status == 'Activated').map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setActiveCategory(category.name.toLowerCase())}
                    className={`block w-full text-left text-sm ${
                      activeCategory === category.name.toLowerCase() ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Brand Filter */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-medium">Brands</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveBrand('all')}
                  className={`block w-full text-left text-sm ${
                    activeBrand === 'all' ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Brands
                </button>
                {brands.filter(brand => brand.status == 'Activated').map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => setActiveBrand(brand._id)}
                    className={`block w-full text-left text-sm ${
                      activeBrand === brand._id ? 'font-medium text-primary' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
            
                        {/* Price Range Filter */}
                        <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="space-y-4">
                {/* Min price range */}
                <div>
                  <label className="text-sm text-gray-600">Min Price: ₹{priceRange[0]}</label>
                  <input
                    type="range"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="mt-2 w-full cursor-pointer"
                  />
                </div>
                {/* Max price range */}
                <div>
                  <label className="text-sm text-gray-600">Max Price: ₹{priceRange[1]}</label>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="mt-2 w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Add Apply/Clear buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="w-full rounded-lg bg-primary px-4 py-2 text-white"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="w-full rounded-lg border px-4 py-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Sorting dropdown - update options */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateFilters({ sort: e.target.value });
              }}
              className="mb-4 rounded-lg border p-2"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            
            {/* Products grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full flex items-center justify-center min-h-[400px]">
                  <Loader />
                </div>
              ) :  products.length > 0 ? ( 
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={Math.min(...product.variants
                      .filter(v => !v.isBlocked)
                      .map(v => v.price))}
                    discountPrice={Math.min(...product.variants
                      .filter(v => !v.isBlocked)
                      .map(v => v.discountPrice || v.price))}
                    imageUrl={product.variants.find(v => !v.isBlocked)?.mainImage}
                    link={`/products/${product._id}`}
                    rating={4.5}
                  />
                ))  
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-sm text-gray-500">
                  {searchTerm ? `No results found for "${searchTerm}"` : 'Try adjusting your filters'}
                </p>
              </div>
              )}
            </div>

            {/* Pagination */}
          
             {totalPages >= 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => currentPage > 1 && updateFilters({ page: currentPage - 1 })}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm ${currentPage === 1 ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'} border transition-colors duration-200`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => updateFilters({ page })}
                          className={`h-10 w-10 rounded-lg ${page === currentPage
                            ? 'bg-primary text-white'
                            : 'border bg-white text-gray-700 hover:bg-gray-50'
                            } flex items-center justify-center transition-colors duration-200`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => currentPage < totalPages && updateFilters({ page: currentPage + 1 })}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'} border transition-colors duration-200`}
                >
                  Next
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
