export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface PropertyAgent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface PropertyFeature {
  icon: string;
  label: string;
  value: string;
}

export interface Property {
  id: string;
  title: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  price: number;
  pricePerSqft: number;
  status: 'For Sale' | 'Pending' | 'Sold' | 'New Listing';
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSize: string;
  garage: number;
  description: string;
  highlights: string[];
  features: {
    interior: PropertyFeature[];
    exterior: PropertyFeature[];
    utilities: PropertyFeature[];
  };
  images: PropertyImage[];
  agent: PropertyAgent;
  daysOnMarket: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}
