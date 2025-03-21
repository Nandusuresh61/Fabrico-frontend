import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Star } from 'lucide-react';
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
  const { selectedProduct: product, loading, error } = useSelector((state) => state.product);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

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
      // Set the first variant as selected by default
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].mainImage);
    }
  }, [product]);

  if (loading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center px-4 py-8 md:px-6 md:py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  const allImages = selectedVariant ? [selectedVariant.mainImage, ...selectedVariant.subImages] : [];

  return (
    <Layout>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="h-full w-full object-cover"
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
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
              <p className="text-sm text-green-600">
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
      </div>
    </Layout>
  );
};

export default ProductDetail;
