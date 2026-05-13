'use client';

import Link from 'next/link';
import { MapPin, BedDouble, Maximize2 } from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  return (
    <Link href={`/properties/${property.id}`} className={cn('flex flex-col h-full', className)}>
      <div className="overflow-hidden flex flex-col h-full bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group">
        <div className="relative aspect-video overflow-hidden shrink-0">
          {property.images?.[0] ? (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-card flex items-center justify-center">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">No Image</span>
            </div>
          )}
          
          <div className="absolute top-3 left-3">
            <span className="bg-primary/90 text-secondary-foreground font-medium px-3 py-1 rounded-lg uppercase tracking-widest text-xs">
              {property.status || 'AVAILABLE'}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={14} />
              <span className="text-xs font-medium uppercase tracking-[0.3em]">{property.city || property.district}</span>
            </div>

            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {property.title}
            </h3>

            <div className="flex items-center gap-6 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <BedDouble size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{property.bhk || 0} BHK</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{property.size || 0} sqft</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {formatPrice(property.price)}
            </p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Asking Price</p>
          </div>
        </div>
      </div>
    </Link>
  );
}