import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Layout from '../../components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { useToast } from '../../hooks/use-toast';
import { addToCart } from '../../redux/features/cartSlice';
import Loader from '../../components/layout/Loader'

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);
    const { items: cartItems } = useSelector((state) => state.cart);
    const { toast } = useToast();

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    const handleRemoveItem = async (itemId) => {
        try {
            await dispatch(removeFromWishlist(itemId)).unwrap();
            toast({
                title: "Success",
                description: "Item removed from wishlist",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    };

    const handleAddToCart = async (item) => {
        try {
            // Check if item already exists in cart
            const existingCartItem = cartItems.find(
                cartItem => 
                    cartItem.product._id === item.product._id && 
                    cartItem.variant._id === item.variant._id
            );

            // If item exists in cart and has reached maximum stock
            if (existingCartItem && existingCartItem.quantity >= item.variant.stock) {
                toast({
                    title: "Cannot Add to Cart",
                    description: "Maximum stock limit reached for this item",
                    variant: "destructive",
                });
                // Remove from wishlist since it can't be added to cart
                await dispatch(removeFromWishlist(item._id)).unwrap();
                return;
            }

            // Add to cart
            await dispatch(addToCart({
                productId: item.product._id,
                variantId: item.variant._id
            })).unwrap();

            // Remove from wishlist
            await dispatch(removeFromWishlist(item._id)).unwrap();

            toast({
                title: "Success",
                description: "Item added to cart",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    };

    const calculateDiscount = (price, discountPrice) => {
        if (!discountPrice || discountPrice >= price) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
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

    const isWishlistEmpty = wishlistItems.length === 0;

    return (
        <Layout>
            <div className="container max-w-7xl px-4 py-8 mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
                
                {isWishlistEmpty ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                        <Heart className="h-16 w-16 text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-6">Save items you love to your wishlist and they'll appear here.</p>
                        <Button asChild variant="default">
                            <Link to="/products">Explore Products</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {wishlistItems.map((item) => {
                            // Check if item exists in cart and has reached maximum stock
                            const existingCartItem = cartItems.find(
                                cartItem => 
                                    cartItem.product._id === item.product._id && 
                                    cartItem.variant._id === item.variant._id
                            );
                            const isMaxStockReached = existingCartItem && existingCartItem.quantity >= item.variant.stock;

                            return (
                                <div 
                                    key={item._id} 
                                    className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative group"
                                >
                                    <div 
                                        onClick={() => handleProductClick(item.product._id)}
                                        className="cursor-pointer group"
                                    >
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden transition-transform group-hover:scale-105">
                                            <img 
                                                src={item.variant.mainImage} 
                                                alt={item.product.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 pr-8 sm:pr-0">
                                        <h3 
                                            onClick={() => handleProductClick(item.product._id)}
                                            className="text-base font-medium text-gray-900 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Brand: {item.product.brand?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Category: {item.product.category?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Color: {item.variant.color}
                                        </p>
                                        <div className="mt-1">
                                            <span 
                                                className={`text-sm px-2 py-0.5 rounded-full ${
                                                    item.variant.stock > 0 
                                                        ? 'bg-green-50 text-green-700' 
                                                        : 'bg-red-50 text-red-700'
                                                }`}
                                            >
                                                {item.variant.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 sm:mt-0 w-full sm:w-auto flex flex-col sm:items-end gap-2">
                                        <div className="flex flex-col items-end gap-1">
                                            {item.variant.discountPrice ? (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-medium">₹{item.variant.discountPrice}</span>
                                                        <span className="text-sm text-gray-500 line-through">₹{item.variant.price}</span>
                                                    </div>
                                                    <span className="text-sm text-green-600">
                                                        {calculateDiscount(item.variant.price, item.variant.discountPrice)}% OFF
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-medium">₹{item.variant.price}</span>
                                            )}
                                        </div>
                                        <Button 
                                            variant="default" 
                                            size="sm" 
                                            className="sm:w-auto w-full"
                                            disabled={item.variant.stock === 0 || isMaxStockReached}
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            {isMaxStockReached ? 'Maximum Stock Reached' : 'Add to Cart'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="sm:w-auto w-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={() => handleRemoveItem(item._id)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlist;
