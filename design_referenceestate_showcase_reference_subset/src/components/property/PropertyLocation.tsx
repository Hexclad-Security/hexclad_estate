import { Property } from '@/types/property';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyLocationProps {
  property: Property;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Location</h2>
      
      <Card className="overflow-hidden">
        {/* Map Placeholder */}
        <div className="h-64 bg-muted relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive map</p>
              <p className="text-sm text-muted-foreground">{property.address.full}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{property.address.street}</p>
              <p className="text-muted-foreground">
                {property.address.city}, {property.address.state} {property.address.zip}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Neighborhood Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Walk Score', value: '85', desc: 'Very Walkable' },
          { label: 'Transit Score', value: '72', desc: 'Excellent Transit' },
          { label: 'Bike Score', value: '68', desc: 'Bikeable' },
          { label: 'Schools', value: '9/10', desc: 'Beverly Hills USD' }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{item.value}</p>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
