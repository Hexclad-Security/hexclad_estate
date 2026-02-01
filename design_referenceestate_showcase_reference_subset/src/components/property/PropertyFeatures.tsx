import { Property } from '@/types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bed, Bath, Ruler, Flame, Thermometer, Wind, Layers, Building,
  Landmark, Car, Waves, Trees, Home, Calendar,
  Zap, Droplet, Wifi, Shield
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bed, Bath, Ruler, Flame, Thermometer, Wind, Layers, Building,
  Landmark, Car, Waves, Trees, Home, Calendar,
  Zap, Droplet, Wifi, Shield
};

interface PropertyFeaturesProps {
  features: Property['features'];
}

export function PropertyFeatures({ features }: PropertyFeaturesProps) {
  const renderFeatureGrid = (items: Property['features']['interior']) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((feature, index) => {
        const Icon = iconMap[feature.icon] || Home;
        return (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Icon className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">{feature.label}</p>
              <p className="font-medium">{feature.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Features & Amenities</h2>
      
      <Tabs defaultValue="interior" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interior">Interior</TabsTrigger>
          <TabsTrigger value="exterior">Exterior</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
        </TabsList>
        <TabsContent value="interior" className="mt-4">
          {renderFeatureGrid(features.interior)}
        </TabsContent>
        <TabsContent value="exterior" className="mt-4">
          {renderFeatureGrid(features.exterior)}
        </TabsContent>
        <TabsContent value="utilities" className="mt-4">
          {renderFeatureGrid(features.utilities)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
