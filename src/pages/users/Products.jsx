import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/layout';
import ProductCard from '../../components/ui/ProductCard';
import { getAllProductsForUsers } from '../../redux/features/productSlice';
import { getAllCategories } from '../../redux/features/categorySlice';
import { fetchBrands } from '../../redux/features/brandSlice';

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

    // Remove default values from URL
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

  // Apply filters
  const handleApplyFilters = () => {
    updateFilters({ page: 1 }); // Reset to first page when applying filters
  };

  // Clear filters
  const handleClearFilters = () => {
    setActiveCategory('all');
    setActiveBrand('all');
    setPriceRange([0, 1000]);
    setSortBy('featured');
    setSearchTerm('');
    setSearchParams({});
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm, page: 1 });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    updateFilters({ search: '', page: 1 });
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
      limit: 12
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
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded-lg border p-2"
          />
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-white">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg border px-4 py-2"
            >
              Clear
            </button>
          )}
        </form>

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
                {categories.map((category) => (
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
                {brands.map((brand) => (
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
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="mt-2 w-full cursor-pointer"
              />
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
                <div>Loading...</div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={Math.min(...product.variants
                      .filter(v => !v.isBlocked)
                      .map(v => v.price))}
                    imageUrl={product.variants.find(v => !v.isBlocked)?.mainImage}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => updateFilters({ page })}
                    className={`h-8 w-8 rounded-full ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'border bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
