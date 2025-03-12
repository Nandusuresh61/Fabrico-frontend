import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const ProductCard = ({ 
  id, 
  name, 
  price, 
  discountPrice, 
  imageUrl, 
  rating = 0,
  className,
  isNew = false,
  isFeatured = false
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const hasDiscount = discountPrice !== undefined && discountPrice < price;
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Image container */}
      <div className="product-image-container aspect-square overflow-hidden bg-gray-100">
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

        {/* Badge indicators */}
        {(isNew || isFeatured) && (
          <div className="absolute left-3 top-3 flex flex-col gap-2">
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

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-1">{name}</h3>
        
        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold">${discountPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-500 line-through">${price.toFixed(2)}</span>
              <span className="ml-auto text-xs font-medium text-green-600">
                {Math.round(((price - discountPrice) / price) * 100)}% OFF
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold">${price.toFixed(2)}</span>
          )}
        </div>

        {/* Ratings */}
        {rating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  className={`h-3.5 w-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({rating.toFixed(1)})</span>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
};

export default ProductCard;
