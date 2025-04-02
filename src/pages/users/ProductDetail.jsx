import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Star, ChevronRight, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../../components/ui/CustomButton';
import ProductCard from '../../components/ui/ProductCard';
import { getProductById, clearSelectedProduct } from '../../redux/features/productSlice';
import { useToast } from '../../hooks/use-toast';
import { getAllProductsForUsers } from '../../redux/features/productSlice';
import { addToWishlist } from '../../redux/features/wishlistSlice';
import { addToCart } from '../../redux/features/cartSlice';
import Loader from '../../components/layout/Loader'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { selectedProduct: product, products, loading } = useSelector((state) => state.product);
  const { user } = useSelector(state => state.user);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getProductById(id))
      .unwrap()
      .catch((error) => {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        });
        navigate('/products');
      });

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id, navigate, toast]);

  useEffect(() => {
    if (product?.category?._id) {
      dispatch(getAllProductsForUsers({
        status: 'active',
        limit: 6,
        category: product.category.name // Use the current product's category
      }));
    }
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);

    if (product) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].mainImage);
    }
    return () => clearTimeout(timer);
  }, [product, dispatch]);

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a variant first",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(addToWishlist({
        productId: product._id,
        variantId: selectedVariant._id
      })).unwrap();

      toast({
        title: "Success",
        description: "Added to wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a variant first",
        variant: "destructive",
      });
      return;
    }

    // Check if quantity exceeds stock
    if (quantity > selectedVariant.stock) {
      toast({
        title: "Error",
        description: `Only ${selectedVariant.stock} items available in stock`,
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity: quantity
      })).unwrap();

      toast({
        title: "Success",
        description: "Added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="col-span-full flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
      </Layout>
    );
  }

  if (!product) return null;

  const allImages = selectedVariant ? [selectedVariant.mainImage, ...selectedVariant.subImages] : [];


  return (
    <Layout>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="mb-12 grid gap-12 md:grid-cols-2">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Sub Images */}
            <div className="flex h-[480px] flex-col items-center">
              <div className="mt-[60px]">
                <button
                  onClick={() => setMainImage(allImages[0])}
                  className={`h-24 w-24 overflow-hidden rounded-lg border-2 ${
                    mainImage === allImages[0] ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={allImages[0]} alt={`${product.name} view 1`} className="h-full w-full object-cover" />
                </button>
              </div>

              <div className="my-auto">
                {allImages[1] && (
                  <button
                    onClick={() => setMainImage(allImages[1])}
                    className={`h-24 w-24 overflow-hidden rounded-lg border-2 ${
                      mainImage === allImages[1] ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={allImages[1]} alt={`${product.name} view 2`} className="h-full w-full object-cover" />
                  </button>
                )}
              </div>

              <div className="mb-[60px]">
                {allImages[2] && (
                  <button
                    onClick={() => setMainImage(allImages[2])}
                    className={`h-24 w-24 overflow-hidden rounded-lg border-2 ${
                      mainImage === allImages[2] ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={allImages[2]} alt={`${product.name} view 3`} className="h-full w-full object-cover" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Image */}
            <div 
              className="relative h-[450px] w-[450px] overflow-hidden rounded-xl"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className={`h-full w-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : ''
                }`}
                style={isZoomed ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                } : undefined}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-4 w-4 ${star <= 4.5 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'fill-gray-200 text-gray-200'
                      }`} 
                    />
                  ))}
                  <span className="text-sm font-medium">4.5</span>
                  <span className="text-sm text-gray-500">(128 reviews)</span>
                </div>
                <span className="text-sm text-gray-500">Brand: {product.brand?.name}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              {selectedVariant?.discountPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">₹{selectedVariant.discountPrice}</span>
                    <span className="text-lg text-gray-500 line-through">₹{selectedVariant.price}</span>
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100)}% OFF
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold">₹{selectedVariant?.price}</span>
              )}
              <p className={selectedVariant?.stock>0 ? "text-sm text-green-600":"text-sm text-red-600"}>
                {selectedVariant?.stock > 0 ? `Stock Available (${selectedVariant?.stock})` : 'Out of Stock'}
              </p>
            </div>
            
            <p className="text-gray-700">{product.description}</p>
            
            <div>
              <label className="mb-2 block font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setMainImage(variant.mainImage);
                    }}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      selectedVariant?._id === variant._id
                        ? 'border-primary bg-primary/5 font-medium text-primary'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="mb-2 block font-medium">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-l-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-16 border-y border-gray-300 text-center outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-r-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <CustomButton 
                icon={<ShoppingCart className="h-4 w-4" />}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </CustomButton>
              <CustomButton 
                variant="outline" 
                icon={<Heart className="h-4 w-4" />}
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </CustomButton>
            </div>
            
            <div className="border-t border-gray-200 pt-4 text-sm text-gray-600">
              <p>Category: {product.category?.name}</p>
              <p>Brand: {product.brand?.name}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <details className="group rounded-lg border border-gray-200">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-6 py-4">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <div className="transition-transform duration-200 group-open:rotate-180">
                <ChevronRight className="h-5 w-5" />
              </div>
            </summary>
            <div className="space-y-6 px-6 py-4">
              {/* Dummy reviews */}
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-4 w-4 ${star <= 4 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">2 months ago</span>
                  </div>
                  <h3 className="mt-2 font-medium">John Doe</h3>
                  <p className="mt-2 text-gray-600">
                    Great product! The quality is excellent and it arrived quickly.
                  </p>
                </div>
              ))}
            </div>
          </details>

           {/* related Products Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Similar Products
              </h2>
              <Link 
                to={`/products?category=${product.category?.name?.toLowerCase()}`}
                className="group flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-primary"
              >
                View All 
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="relative">
              {loading ? (
                <div className="flex justify-center py-8">
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6">
                  {products
                    .filter(p => p._id !== product._id) // Exclude current product
                    .map((product) => {
                      const lowestPriceVariant = product.variants
                        .filter(v => !v.isBlocked)
                        .reduce((min, v) => {
                          // Consider discountPrice when finding the lowest price variant
                          const effectivePrice = v.discountPrice && v.discountPrice < v.price 
                            ? v.discountPrice 
                            : v.price;
                          const minEffectivePrice = min.discountPrice && min.discountPrice < min.price 
                            ? min.discountPrice 
                            : min.price;
                          return effectivePrice < minEffectivePrice ? v : min;
                        }, product.variants[0]);

                      // Skip products without valid variants
                      if (!lowestPriceVariant) return null;

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
                    })
                    .filter(Boolean) // Remove null entries
                    .slice(0, 6) // Limit to 6 products
                  }
                </div>
              )}
              
              {/* Show message if no related products */}
              {products.filter(p => p._id !== product._id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No similar products found
                </div>
              )}
            </div>
          </div>
        </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
