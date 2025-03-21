import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/layout';
import ProductCard from '../../components/ui/ProductCard';
import { getAllProductsForUsers } from '../../redux/features/productSlice'; // Update import
import { getAllCategories } from '../../redux/features/categorySlice';
import { fetchBrands } from '../../redux/features/brandSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { brands } = useSelector((state) => state.brands);
  const [searchParams] = useSearchParams();

  // Get category from URL query params
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    // Update active category when URL changes
    setActiveCategory(categoryFromUrl || 'all');
    
    // Replace getAllProducts with getAllProductsForUsers
    dispatch(getAllProductsForUsers({ 
      search: searchFromUrl || '', 
      category: categoryFromUrl || '',
      page: 1,
      limit: 12
    }));
    dispatch(getAllCategories());
    dispatch(fetchBrands());
  }, [dispatch, categoryFromUrl, searchFromUrl]);

  // Filter products based on selected criteria
  const filteredProducts = products.filter((product) => {
    // Filter out blocked products
    if (product.status === 'blocked') {
      return false;
    }

    // Filter out products with blocked categories
    if (product.category?.status === 'Deactivated') {
      return false;
    }

    // Filter out products with blocked brands
    if (product.brand?.status === 'Deactivated') {
      return false;
    }

    // Filter by category
    if (activeCategory !== 'all') {
      // Check if the product's category name matches the active category
      const productCategory = product.category?.name?.toLowerCase();
      if (productCategory !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // Filter by brand
    if (activeBrand !== 'all' && product.brand?._id !== activeBrand) {
      return false;
    }

    // Check if product has any non-blocked variants
    const hasActiveVariants = product.variants.some(variant => !variant.isBlocked);
    if (!hasActiveVariants) {
      return false;
    }

    // Filter by price range - only consider non-blocked variants
    const activeVariants = product.variants.filter(variant => !variant.isBlocked);
    if (activeVariants.length > 0) {
      const lowestPrice = Math.min(...activeVariants.map(v => v.price));
      if (lowestPrice < priceRange[0] || lowestPrice > priceRange[1]) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  });

  // Sort products - only consider non-blocked variants for pricing
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const activeVariantsA = a.variants.filter(v => !v.isBlocked);
    const activeVariantsB = b.variants.filter(v => !v.isBlocked);
    
    const priceA = activeVariantsA.length > 0 ? Math.min(...activeVariantsA.map(v => v.price)) : 0;
    const priceB = activeVariantsB.length > 0 ? Math.min(...activeVariantsB.map(v => v.price)) : 0;

    switch (sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="mb-8 text-3xl font-bold">
          {categoryFromUrl ? `${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Products` : 'Shop Products'}
        </h1>
        
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
          </div>
          
          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Sorting */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">{sortedProducts.length} products</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            
            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div>Loading...</div>
              ) : (
                sortedProducts.map((product) => {
                  // Get the first non-blocked variant
                  const activeVariants = product.variants.filter(v => !v.isBlocked);
                  const firstActiveVariant = activeVariants[0];
                  if (!firstActiveVariant) return null;

                  return (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={firstActiveVariant.price}
                      discountPrice={firstActiveVariant.discountPrice}
                      imageUrl={firstActiveVariant.mainImage}
                      rating={4.5}
                    />
                  );
                })
              )}
            </div>
            
            {/* Pagination - You can implement this later based on your backend pagination */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                  &lt;
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-white">
                  1
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
