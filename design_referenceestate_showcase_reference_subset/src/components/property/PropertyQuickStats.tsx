import { Bed, Bath, Ruler, Calendar, Home, Car } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyQuickStatsProps {
  property: Property;
}

export function PropertyQuickStats({ property }: PropertyQuickStatsProps) {
  const stats = [
    { icon: Bed, label: 'Beds', value: property.beds },
    { icon: Bath, label: 'Baths', value: property.baths },
    { icon: Ruler, label: 'Sq Ft', value: property.sqft.toLocaleString() },
    { icon: Calendar, label: 'Built', value: property.yearBuilt },
    { icon: Home, label: 'Type', value: property.type.split(' ')[0] },
    { icon: Car, label: 'Garage', value: `${property.garage}-car` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          <stat.icon className="w-5 h-5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="font-semibold">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
