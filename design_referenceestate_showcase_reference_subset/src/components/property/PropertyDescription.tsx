import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncateLength = 500;
  const shouldTruncate = description.length > truncateLength;

  const displayText = isExpanded || !shouldTruncate 
    ? description 
    : description.slice(0, truncateLength) + '...';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">About This Property</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground">
        {displayText.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      {shouldTruncate && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          {isExpanded ? (
            <>Show less <ChevronUp className="w-4 h-4 ml-1" /></>
          ) : (
            <>Read more <ChevronDown className="w-4 h-4 ml-1" /></>
          )}
        </Button>
      )}
    </div>
  );
}
