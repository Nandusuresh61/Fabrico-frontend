import { Heart, Star, StarHalf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const ProductCard = ({ 
  id, 
  name, 
  price, 
  discountPrice, 
  imageUrl, 
  rating = 4.5,
  className,
  isNew = false,
  isFeatured = false,
  link
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const discountPercentage = calculateDiscount();
  const hasDiscount = discountPrice && discountPrice < price;
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="h-4 w-4 text-yellow-400"
        />
      );
    }

    return stars;
  };

  return (
    <Link 
      to={link} 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Image container with discount badge */}
      <div className="product-image-container aspect-square overflow-hidden bg-gray-100 relative">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        )}
        <img 
          src={imageUrl} 
          alt={name} 
          className={cn(
            "product-image h-full w-full object-cover",
            !isImageLoaded && "opacity-0"
          )} 
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Updated Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-0 top-2">
            <span className="bg-red-500 text-white px-2.5 py-1 text-sm font-bold rounded-r-md shadow-sm">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button 
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white"
        >
          <Heart 
            size={20} 
            className={cn(
              "transition-colors duration-300",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600",
            )} 
          />
        </button>

        {/* Badge indicators - moved below discount badge */}
        {(isNew || isFeatured) && (
          <div className="absolute left-3 top-14 flex flex-col gap-2">
            {isNew && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                New
              </span>
            )}
            {isFeatured && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                Featured
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content section with updated price display */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-1">{name}</h3>
        
        {/* Price Display */}
        <div className="mt-auto space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {/* Current Price */}
            <span className="text-lg font-bold text-primary">
              ₹{(hasDiscount ? discountPrice : price).toFixed(2)}
            </span>
            
            {/* Original Price with MRP tag */}
            {hasDiscount && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">M.R.P:</span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Discount Info */}
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {discountPercentage}% OFF
              </span>
              <span className="text-xs text-green-600">
                Save ₹{(price - discountPrice).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Ratings */}
        <div className="mt-3 flex items-center gap-1">
          {renderStars(rating)}
          <span className="text-xs text-gray-600">({rating.toFixed(1)})</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
};

export default ProductCard;
