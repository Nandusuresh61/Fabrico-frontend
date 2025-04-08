import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/ui/ProductCard';
import CustomButton from '../../components/ui/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsForUsers } from '../../redux/features/productSlice';

import Loader from '../../components/layout/Loader';

// Categories
const categories = [
  {
    id: '1',
    name: 'Shop',
    image: '/products.jpg',
    path: '/products',
  },
  {
    id: '2',
    name: 'Men',
    image: '/men.png',
    path: '/products?category=Men',
  },
  {
    id: '3',
    name: 'Women',
    image: '/women.png',
    path: '/products?category=women',
  },
  {
    id: '4',
    name: 'Kids',
    image: '/kids.png',
    path: '/products?category=kids',
  },
];

const Index = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
   
    dispatch(getAllProductsForUsers({
      status: 'active',
      limit: 6 
    }));

    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <Layout>
      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-50">
          <div className="container relative z-10 px-4 py-12 sm:py-16 md:px-6 md:py-20 lg:py-24">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="animate-slide-in">
                <div className="mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
                  New Collection
                </div>
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                  Elevate Your Style With Premium Caps
                </h1>
                <p className="mb-6 max-w-md text-base text-gray-600">
                  Discover our curated collection of high-quality caps designed for comfort, style, and everyday wear.
                </p>
                <div className="flex flex-wrap gap-4">
                  <CustomButton size="lg">
                    <Link to="/products">Shop Now</Link>
                  </CustomButton>
                  {/* <CustomButton size="lg" variant="outline">
                    <Link to="/products?category=new-arrivals">New Arrivals</Link>
                  </CustomButton> */}
                </div>
              </div>
              <div className="relative animate-fade-in">
                <img
                  src="/banner.png"
                  alt="Featured cap"
                  className="mx-auto max-h-[400px] rounded-xl shadow-lg md:ml-auto"
                />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary/10 backdrop-blur-xl"></div>
                <div className="absolute -right-6 top-1/4 h-12 w-12 rounded-full bg-primary/10 backdrop-blur-xl"></div>
              </div>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute -left-8 -top-8 h-48 w-48 rounded-full bg-primary/5"></div>
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/5"></div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Available Products
              </h2>
              <Link 
                to="/products" 
                className="group flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-primary"
              >
                View All 
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="relative">
              {loading ? (
                <div className="col-span-full flex items-center justify-center min-h-[400px]">
                  <Loader />
                </div>
              ) : (
                <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6">
                  {products.map((product) => {
                    const lowestPriceVariant = product.variants
                      .filter(v => !v.isBlocked)
                      .reduce((min, v) => {
                        // Consider discountPrice when finding the lowest price variant
                        const effectivePrice = v.discountPrice && v.discountPrice < v.price ? v.discountPrice : v.price;
                        const minEffectivePrice = min.discountPrice && min.discountPrice < min.price ? min.discountPrice : min.price;
                        return effectivePrice < minEffectivePrice ? v : min;
                      }, product.variants[0]);

                    return (
                      <div key={product._id} className="min-w-[240px] max-w-[240px] snap-start sm:min-w-[280px] sm:max-w-[280px]">
                        <ProductCard 
                          id={product._id}
                          name={product.name}
                          price={lowestPriceVariant.price}
                          discountPrice={lowestPriceVariant.discountPrice}
                          imageUrl={lowestPriceVariant.mainImage}
                          link={`/products/${product._id}`}
                          rating={4.5}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-gray-50 py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Shop by Category
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Explore our wide range of cap styles for every occasion
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.path}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-black/0 p-6 text-white">
                    <div className="flex w-full items-center justify-between">
                      <h3 className="text-lg font-medium">{category.name}</h3>
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
