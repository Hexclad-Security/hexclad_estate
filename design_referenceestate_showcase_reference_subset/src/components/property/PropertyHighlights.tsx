import { Badge } from '@/components/ui/badge';
import { Sparkles, Check } from 'lucide-react';

interface PropertyHighlightsProps {
  highlights: string[];
  daysOnMarket: number;
  status: string;
}

export function PropertyHighlights({ highlights, daysOnMarket, status }: PropertyHighlightsProps) {
  return (
    <div className="space-y-4">
      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {status === 'New Listing' && (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            New Listing
          </Badge>
        )}
        {daysOnMarket <= 7 && (
          <Badge variant="secondary">
            {daysOnMarket} days on market
          </Badge>
        )}
      </div>
      
      {/* Feature Highlights */}
      <div className="flex flex-wrap gap-2">
        {highlights.map((highlight, index) => (
          <div 
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium"
          >
            <Check className="w-3.5 h-3.5" />
            {highlight}
          </div>
        ))}
      </div>
    </div>
  );
}
