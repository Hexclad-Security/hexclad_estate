import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Share2, Printer } from 'lucide-react';

interface PriceCardProps {
  property: Property;
}

export function PriceCard({ property }: PriceCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-foreground">{formattedPrice}</span>
            {property.status === 'New Listing' && (
              <Badge className="bg-primary text-primary-foreground">New</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            ${property.pricePerSqft.toLocaleString()} / sq ft
          </p>
        </div>

        {/* Estimated Payment */}
        <div className="p-3 bg-muted/50 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground">Estimated payment</p>
          <p className="font-semibold text-lg">
            ${Math.round(property.price * 0.005).toLocaleString()}/mo
          </p>
          <p className="text-xs text-muted-foreground">30-yr fixed, 20% down</p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-6">
          <Button className="w-full" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Tour
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Request Info
          </Button>
        </div>

        {/* Action Icons */}
        <div className="flex justify-center gap-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Heart className="w-5 h-5 mb-1" />
            <span className="text-xs">Save</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Share2 className="w-5 h-5 mb-1" />
            <span className="text-xs">Share</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Printer className="w-5 h-5 mb-1" />
            <span className="text-xs">Print</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
