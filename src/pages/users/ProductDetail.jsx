import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import CustomButton from '../../components/ui/CustomButton';
import ProductCard from '../../components/ui/ProductCard';
import { getProductById, clearSelectedProduct } from '../../redux/features/productSlice';
import { useToast } from '../../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { selectedProduct: product, loading } = useSelector((state) => state.product);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    if (product) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].mainImage);
    }
  }, [product]);

  // Handle image zoom
  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center px-4 py-8 md:px-6 md:py-12">
          <div className="text-lg">Loading...</div>
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
          <div className="space-y-4">
            <div 
              className="relative aspect-square overflow-hidden rounded-xl"
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
            <div className="flex flex-wrap gap-3">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                    mainImage === image ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
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
                    <span className="text-2xl font-bold">${selectedVariant.discountPrice}</span>
                    <span className="text-lg text-gray-500 line-through">${selectedVariant.price}</span>
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {Math.round(((selectedVariant.price - selectedVariant.discountPrice) / selectedVariant.price) * 100)}% OFF
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold">${selectedVariant?.price}</span>
              )}
              <p className={selectedVariant?.stock>0 ? "text-sm text-green-600":"text-sm text-red-600"}>
                {selectedVariant?.stock > 0 ? 'In Stock' : 'Out of Stock'}
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
              >
                Add to Cart
              </CustomButton>
              <CustomButton variant="outline" icon={<Heart className="h-4 w-4" />}>
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
          <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
          <div className="space-y-6">
            {/* Dummy reviews */}
            {[1, 2, 3].map((review) => (
              <div key={review} className="border-b border-gray-200 pb-6">
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
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
