import { Property } from '@/types/property';

export const sampleProperty: Property = {
  id: 'prop-001',
  title: 'Modern Mediterranean Estate',
  address: {
    street: '2847 Sunset Boulevard',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90210',
    full: '2847 Sunset Boulevard, Beverly Hills, CA 90210'
  },
  price: 4250000,
  pricePerSqft: 850,
  status: 'New Listing',
  type: 'Single Family Home',
  beds: 5,
  baths: 4.5,
  sqft: 5000,
  yearBuilt: 2019,
  lotSize: '0.45 acres',
  garage: 3,
  description: `Welcome to this extraordinary Mediterranean estate nestled in the prestigious hills of Beverly Hills. This architectural masterpiece seamlessly blends timeless elegance with modern luxury, offering an unparalleled living experience.

The grand foyer welcomes you with soaring 20-foot ceilings and imported Italian marble floors. The open-concept living areas flow effortlessly into the gourmet chef's kitchen, featuring custom cabinetry, top-of-the-line Sub-Zero and Wolf appliances, and a stunning waterfall island.

The primary suite is a true sanctuary with panoramic city views, a spa-like bathroom with dual vanities, a steam shower, and a freestanding soaking tub. Four additional en-suite bedrooms provide comfort and privacy for family and guests.

Step outside to your private oasis featuring a resort-style infinity pool, outdoor kitchen, and meticulously landscaped grounds. The property also includes a home theater, wine cellar, smart home automation, and a 3-car garage.`,
  highlights: [
    'Infinity Pool',
    'Home Theater',
    'Wine Cellar',
    'Smart Home',
    'Gated Entry',
    'City Views'
  ],
  features: {
    interior: [
      { icon: 'Bed', label: 'Bedrooms', value: '5' },
      { icon: 'Bath', label: 'Bathrooms', value: '4.5' },
      { icon: 'Ruler', label: 'Living Area', value: '5,000 sq ft' },
      { icon: 'Flame', label: 'Fireplaces', value: '3' },
      { icon: 'Thermometer', label: 'Heating', value: 'Central' },
      { icon: 'Wind', label: 'Cooling', value: 'Central A/C' },
      { icon: 'Layers', label: 'Flooring', value: 'Hardwood, Marble' },
      { icon: 'Building', label: 'Stories', value: '2' }
    ],
    exterior: [
      { icon: 'Landmark', label: 'Lot Size', value: '0.45 acres' },
      { icon: 'Car', label: 'Garage', value: '3-car attached' },
      { icon: 'Waves', label: 'Pool', value: 'Infinity Pool' },
      { icon: 'Trees', label: 'Landscaping', value: 'Professional' },
      { icon: 'Home', label: 'Style', value: 'Mediterranean' },
      { icon: 'Calendar', label: 'Year Built', value: '2019' }
    ],
    utilities: [
      { icon: 'Zap', label: 'Electric', value: 'SCE' },
      { icon: 'Droplet', label: 'Water', value: 'Municipal' },
      { icon: 'Wifi', label: 'Internet', value: 'Fiber Ready' },
      { icon: 'Shield', label: 'Security', value: '24/7 Monitored' }
    ]
  },
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', alt: 'Front exterior', isPrimary: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: 'Living room' },
    { id: '3', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Kitchen' },
    { id: '4', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', alt: 'Primary bedroom' },
    { id: '5', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', alt: 'Pool area' },
    { id: '6', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', alt: 'Bathroom' }
  ],
  agent: {
    id: 'agent-001',
    name: 'Sarah Mitchell',
    title: 'Luxury Property Specialist',
    phone: '(310) 555-0147',
    email: 'sarah.mitchell@luxuryrealty.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
  },
  daysOnMarket: 3,
  coordinates: {
    lat: 34.0901,
    lng: -118.4065
  }
};
