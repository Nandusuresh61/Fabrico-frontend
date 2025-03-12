
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/ui/ProductCard';
import CustomButton from '../../components/ui/CustomButton';

// Mock data
const featuredProducts = [
  {
    id: '1',
    name: 'Vintage Baseball Cap',
    price: 39.99,
    discountPrice: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1536&auto=format&fit=crop',
    rating: 4.5,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Classic Snapback',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1548&auto=format&fit=crop',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Premium Trucker Cap',
    price: 49.99,
    discountPrice: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1470&auto=format&fit=crop',
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Urban Fitted Cap',
    price: 55.99,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1587&auto=format&fit=crop',
    rating: 4.0,
  },
  {
    id: '5',
    name: 'Minimalist Dad Hat',
    price: 35.99,
    discountPrice: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1552060155-4b9a038bc4d3?q=80&w=1587&auto=format&fit=crop',
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Sport Performance Cap',
    price: 42.99,
    imageUrl: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1470&auto=format&fit=crop',
    rating: 4.3,
  },
];

const newArrivals = [
  {
    id: '7',
    name: 'Limited Edition Cap',
    price: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1470&auto=format&fit=crop',
    rating: 4.9,
    isNew: true,
  },
  {
    id: '8',
    name: 'Designer Collaboration Cap',
    price: 65.99,
    discountPrice: 55.99,
    imageUrl: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=1487&auto=format&fit=crop',
    rating: 4.7,
    isNew: true,
  },
  {
    id: '9',
    name: 'Eco-Friendly Cap',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1523&auto=format&fit=crop',
    rating: 4.5,
    isNew: true,
  },
  {
    id: '10',
    name: 'Heritage Collection Cap',
    price: 52.99,
    imageUrl: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1364&auto=format&fit=crop',
    rating: 4.4,
    isNew: true,
  },
];

// Categories
const categories = [
  {
    id: '1',
    name: 'Baseball Caps',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1548&auto=format&fit=crop',
    path: '/products?category=baseball-caps',
  },
  {
    id: '2',
    name: 'Trucker Caps',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1470&auto=format&fit=crop',
    path: '/products?category=trucker-caps',
  },
  {
    id: '3',
    name: 'Snapbacks',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1587&auto=format&fit=crop',
    path: '/products?category=snapbacks',
  },
  {
    id: '4',
    name: 'Dad Hats',
    image: 'https://images.unsplash.com/photo-1552060155-4b9a038bc4d3?q=80&w=1587&auto=format&fit=crop',
    path: '/products?category=dad-hats',
  },
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-50">
          <div className="container relative z-10 px-4 py-20 sm:py-24 md:px-6 md:py-28 lg:py-32">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="animate-slide-in">
                <div className="mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
                  New Collection
                </div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Elevate Your Style With Premium Caps
                </h1>
                <p className="mb-8 max-w-md text-lg text-gray-600">
                  Discover our curated collection of high-quality caps designed for comfort, style, and everyday wear.
                </p>
                <div className="flex flex-wrap gap-4">
                  <CustomButton size="lg">
                    <Link to="/products">Shop Now</Link>
                  </CustomButton>
                  <CustomButton size="lg" variant="outline">
                    <Link to="/products?category=new-arrivals">New Arrivals</Link>
                  </CustomButton>
                </div>
              </div>
              <div className="relative animate-fade-in">
                <img
                  src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1536&auto=format&fit=crop"
                  alt="Featured cap"
                  className="mx-auto rounded-xl shadow-lg md:ml-auto"
                />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 backdrop-blur-xl"></div>
                <div className="absolute -right-8 top-1/4 h-16 w-16 rounded-full bg-primary/10 backdrop-blur-xl"></div>
              </div>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-primary/5"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/5"></div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Featured Products
              </h2>
              <Link 
                to="/products?featured=true" 
                className="group flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-primary"
              >
                View All 
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="min-w-[240px] max-w-[240px] snap-start sm:min-w-[280px] sm:max-w-[280px]">
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
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
        
        {/* New Arrivals Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                New Arrivals
              </h2>
              <Link 
                to="/products?category=new-arrivals" 
                className="group flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-primary"
              >
                View All 
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Promotion Banner */}
        <section className="bg-primary py-16 text-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">
                Join Our Community
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Sign up for our newsletter and receive 15% off your first order, plus early access to new releases and exclusive offers.
              </p>
              <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border-none bg-white/10 px-4 py-3 text-white placeholder-white/70 backdrop-blur-sm outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <CustomButton className="bg-white text-primary hover:bg-white/90">
                  Subscribe
                </CustomButton>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
