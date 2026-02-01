import { useState } from 'react';
import { PropertyImage } from '@/types/property';
import { ChevronLeft, ChevronRight, Expand, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: PropertyImage[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const primaryImage = images[0];
  const thumbnails = images.slice(1, 5);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Desktop Gallery Grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden">
          {/* Main Image */}
          <div 
            className="col-span-2 row-span-2 relative cursor-pointer group"
            onClick={() => { setSelectedIndex(0); setIsFullscreen(true); }}
          >
            <img 
              src={primaryImage.url} 
              alt={primaryImage.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          
          {/* Thumbnail Grid */}
          {thumbnails.map((image, index) => (
            <div 
              key={image.id}
              className="relative cursor-pointer group overflow-hidden"
              onClick={() => { setSelectedIndex(index + 1); setIsFullscreen(true); }}
            >
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* Show All Photos Button on last thumbnail */}
              {index === thumbnails.length - 1 && images.length > 5 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true); }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium hover:bg-black/60 transition-colors"
                >
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  +{images.length - 5} photos
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm"
          onClick={() => setIsFullscreen(true)}
        >
          <Expand className="w-4 h-4 mr-2" />
          View all photos
        </Button>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <img 
            src={images[selectedIndex].url} 
            alt={images[selectedIndex].alt}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Mobile Navigation */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.slice(0, 6).map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex ? "bg-white w-4" : "bg-white/60"
              )}
            />
          ))}
          {images.length > 6 && (
            <span className="text-white text-xs ml-1">+{images.length - 6}</span>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={images[selectedIndex].url} 
              alt={images[selectedIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            
            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* All Photos Grid Modal */}
      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {images.map((image, index) => (
              <div 
                key={image.id}
                className="aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
                onClick={() => { setSelectedIndex(index); setShowAllPhotos(false); setIsFullscreen(true); }}
              >
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
