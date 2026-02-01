import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, Share2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyHeaderProps {
  property: Property;
}

export function StickyHeader({ property }: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (approximately 500px)
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Property Info */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-semibold text-lg">{formattedPrice}</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {property.address.street}, {property.address.city}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
              <span>{property.beds} beds</span>
              <span>•</span>
              <span>{property.baths} baths</span>
              <span>•</span>
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
