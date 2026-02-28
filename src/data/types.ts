export interface Hotel {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  starRating: number;
  propertyId: string;
  onboardingStatus: 'in_progress' | 'pending_approval' | 'completed' | 'rejected';
  channelManagerConnected: boolean;
  contentScore: number;
  city: string;
  rooms: Room[];
  amenities: string[];
  description: string;
  photos: string[];
}

export interface Room {
  type: string;
  count: number;
  baseRate: number;
}

export interface Contract {
  hotelId: string;
  signatureImage: string;
  accepted: boolean;
  timestamp: string;
}

export interface PerformanceData {
  hotelId: string;
  monthlyRevenue: number[];
  bookings: number[];
  ADR: number[];
  cancellationRate: number[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'content' | 'cm_sync' | 'leaderboard' | 'system';
  message: string;
  readStatus: boolean;
  timestamp: string;
}

export interface OnboardingData {
  step: number;
  hotelBasics: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    phone: string;
    email: string;
    starRating: number;
  };
  rooms: Room[];
  contract: { accepted: boolean; signature: string };
  kyc: { idProof: boolean; taxId: boolean; municipal: boolean; additional: boolean };
  channelManager: { provider: string; apiKey: string; connected: boolean };
  content: {
    description: string;
    amenities: string[];
    photos: string[];
  };
}
