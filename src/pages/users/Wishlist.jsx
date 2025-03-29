import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { useToast } from '../../hooks/use-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.wishlist);
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

    if (loading) {
        return (
            <Layout>
                <div className="container max-w-7xl px-4 py-8 mx-auto">
                    <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
                    <div>Loading...</div>
                </div>
            </Layout>
        );
    }

    const isWishlistEmpty = items.length === 0;

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
                        {items.map((item) => (
                            <div 
                                key={item._id} 
                                className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative group"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden">
                                    <img 
                                        src={item.variant.mainImage} 
                                        alt={item.product.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                <div className="flex-1 pr-8 sm:pr-0">
                                    <h3 className="text-base font-medium text-gray-900">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Brand: {item.product.brand?.name}
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
                                    <span className="text-lg font-medium">
                                        ₹{item.variant.discountPrice || item.variant.price}
                                    </span>
                                    <Button 
                                        variant="default" 
                                        size="sm" 
                                        className="sm:w-auto w-full"
                                        disabled={item.variant.stock === 0}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
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
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlist;
