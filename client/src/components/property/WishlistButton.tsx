'use client';

import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({ propertyId, size = 'md' }: WishlistButtonProps) {
  const { items, addToWishlist, removeFromWishlist } = useWishlistStore();
  const isInWishlist = items.includes(propertyId);

  const handleToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(propertyId);
    } else {
      addToWishlist(propertyId);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      className={cn(
        'rounded-full shrink-0 transition-all flex items-center justify-center backdrop-blur-md border border-white/10',
        sizeClasses[size],
        isInWishlist 
          ? 'bg-primary/90 text-secondary-foreground hover:bg-primary border-primary' 
          : 'bg-white/10 text-white hover:bg-primary hover:text-secondary-foreground hover:border-primary'
      )}
    >
      <Heart 
        size={iconSizes[size]} 
        className={cn('transition-all', isInWishlist && 'fill-current')} 
      />
    </button>
  );
}

export default WishlistButton;