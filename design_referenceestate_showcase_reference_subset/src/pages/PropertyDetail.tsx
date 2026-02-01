import { Property } from '@/types/property';
import { sampleProperty } from '@/data/sampleProperty';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyQuickStats } from '@/components/property/PropertyQuickStats';
import { PropertyHighlights } from '@/components/property/PropertyHighlights';
import { PropertyDescription } from '@/components/property/PropertyDescription';
import { PropertyFeatures } from '@/components/property/PropertyFeatures';
import { PropertyLocation } from '@/components/property/PropertyLocation';
import { PriceCard } from '@/components/property/PriceCard';
import { AgentCard } from '@/components/property/AgentCard';
import { InquiryForm } from '@/components/property/InquiryForm';
import { StickyHeader } from '@/components/property/StickyHeader';
import { MapPin, ChevronRight } from 'lucide-react';

export default function PropertyDetailPage() {
  const property = sampleProperty;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header - appears on scroll */}
      <StickyHeader property={property} />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Home</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <a href="#" className="hover:text-foreground">{property.address.state}</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <a href="#" className="hover:text-foreground">{property.address.city}</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground">{property.address.street}</span>
        </nav>
      </div>

      {/* Hero Gallery Section */}
      <section className="container mx-auto px-4 relative">
        <PropertyGallery images={property.images} />
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Address */}
            <header>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.address.full}</span>
              </div>
              
              {/* Mobile Price - visible on mobile only */}
              <div className="lg:hidden mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  }).format(property.price)}
                </div>
                <p className="text-sm text-muted-foreground">
                  ${property.pricePerSqft}/sqft
                </p>
              </div>
            </header>

            {/* Quick Stats Bar */}
            <PropertyQuickStats property={property} />

            {/* Highlights */}
            <PropertyHighlights 
              highlights={property.highlights}
              daysOnMarket={property.daysOnMarket}
              status={property.status}
            />

            {/* Description */}
            <PropertyDescription description={property.description} />

            {/* Features */}
            <PropertyFeatures features={property.features} />

            {/* Location */}
            <PropertyLocation property={property} />

            {/* Mobile Agent Card & Inquiry Form - visible on mobile only */}
            <div className="lg:hidden space-y-6">
              <AgentCard agent={property.agent} />
              <InquiryForm propertyAddress={property.address.full} />
            </div>
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <aside className="hidden lg:block space-y-6">
            {/* Price Card */}
            <PriceCard property={property} />
            
            {/* Inquiry Form */}
            <InquiryForm propertyAddress={property.address.full} />
            
            {/* Agent Card */}
            <AgentCard agent={property.agent} />
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Footer CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(property.price)}
            </p>
            <p className="text-xs text-muted-foreground">{property.beds} beds • {property.baths} baths</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
              Schedule Tour
            </button>
            <button className="px-4 py-2 border border-border rounded-lg font-medium text-sm">
              Contact
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom padding for mobile sticky footer */}
      <div className="lg:hidden h-24" />
    </div>
  );
}
