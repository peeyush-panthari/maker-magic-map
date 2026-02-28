import { Hotel, PerformanceData, Notification } from './types';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'Starhotels Collezione - Hotel Helvetia & Bristol',
    address: 'Via dei Pescioni 2, 50123 Florence, Italy',
    coordinates: { lat: 43.7696, lng: 11.2558 },
    starRating: 5,
    propertyId: 'SH-FLR-001',
    onboardingStatus: 'completed',
    channelManagerConnected: true,
    contentScore: 88,
    city: 'Florence',
    rooms: [
      { type: 'Standard', count: 30, baseRate: 180 },
      { type: 'Deluxe Sea View', count: 15, baseRate: 320 },
      { type: 'Junior Suite', count: 8, baseRate: 450 },
      { type: 'Presidential Suite', count: 2, baseRate: 1200 },
    ],
    amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant', 'Bar', 'Gym', 'Concierge', 'Room Service'],
    description: 'A luxurious 5-star property in the heart of Florence, offering timeless elegance and modern comfort.',
    photos: [],
  },
  {
    id: 'h2',
    name: 'Starhotels Michelangelo Rome',
    address: 'Via della Stazione di San Pietro 14, 00165 Rome, Italy',
    coordinates: { lat: 41.8955, lng: 12.4558 },
    starRating: 4,
    propertyId: 'SH-ROM-002',
    onboardingStatus: 'completed',
    channelManagerConnected: true,
    contentScore: 75,
    city: 'Rome',
    rooms: [
      { type: 'Standard', count: 50, baseRate: 140 },
      { type: 'Deluxe Sea View', count: 20, baseRate: 240 },
      { type: 'Junior Suite', count: 10, baseRate: 380 },
    ],
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Concierge'],
    description: 'Contemporary elegance near the Vatican, perfect for leisure and business travelers.',
    photos: [],
  },
  {
    id: 'h3',
    name: 'Starhotels Echo Milan',
    address: 'Viale Andrea Doria 4, 20124 Milan, Italy',
    coordinates: { lat: 45.4854, lng: 9.2024 },
    starRating: 4,
    propertyId: 'SH-MIL-003',
    onboardingStatus: 'pending_approval',
    channelManagerConnected: false,
    contentScore: 62,
    city: 'Milan',
    rooms: [
      { type: 'Standard', count: 40, baseRate: 160 },
      { type: 'Deluxe Sea View', count: 12, baseRate: 280 },
    ],
    amenities: ['WiFi', 'Restaurant', 'Gym'],
    description: 'An eco-friendly urban retreat in central Milan.',
    photos: [],
  },
  {
    id: 'h4',
    name: 'Grand Hotel Venezia',
    address: 'Riva degli Schiavoni 4149, 30122 Venice, Italy',
    coordinates: { lat: 45.4341, lng: 12.3456 },
    starRating: 5,
    propertyId: 'SH-VEN-004',
    onboardingStatus: 'in_progress',
    channelManagerConnected: false,
    contentScore: 45,
    city: 'Venice',
    rooms: [
      { type: 'Standard', count: 25, baseRate: 220 },
      { type: 'Junior Suite', count: 6, baseRate: 520 },
    ],
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Room Service'],
    description: '',
    photos: [],
  },
  {
    id: 'h5',
    name: 'Starhotels President Genoa',
    address: 'Corte Lambruschini 4, 16129 Genoa, Italy',
    coordinates: { lat: 44.4056, lng: 8.9463 },
    starRating: 3,
    propertyId: 'SH-GEN-005',
    onboardingStatus: 'completed',
    channelManagerConnected: true,
    contentScore: 92,
    city: 'Genoa',
    rooms: [
      { type: 'Standard', count: 35, baseRate: 110 },
      { type: 'Deluxe Sea View', count: 10, baseRate: 190 },
    ],
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Pool', 'Spa'],
    description: 'A charming seaside property with stunning harbor views.',
    photos: [],
  },
];

export const MOCK_PERFORMANCE: PerformanceData[] = [
  {
    hotelId: 'h1',
    monthlyRevenue: [120000, 135000, 128000, 145000, 160000, 172000],
    bookings: [320, 350, 310, 380, 410, 440],
    ADR: [375, 386, 413, 382, 390, 391],
    cancellationRate: [8, 6, 7, 5, 4, 3],
  },
  {
    hotelId: 'h2',
    monthlyRevenue: [85000, 92000, 88000, 97000, 105000, 112000],
    bookings: [420, 460, 430, 490, 520, 550],
    ADR: [202, 200, 205, 198, 202, 204],
    cancellationRate: [10, 9, 11, 8, 7, 6],
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', type: 'booking', message: 'New booking confirmed for Room 204', readStatus: false, timestamp: new Date().toISOString() },
  { id: 'n2', userId: 'u1', type: 'content', message: 'Content score dropped below 80', readStatus: false, timestamp: new Date().toISOString() },
  { id: 'n3', userId: 'u1', type: 'system', message: 'Channel Manager sync completed', readStatus: true, timestamp: new Date().toISOString() },
  { id: 'n4', userId: 'u2', type: 'system', message: 'New hotel pending approval: Grand Hotel Venezia', readStatus: false, timestamp: new Date().toISOString() },
];

export const MOCK_MARKET_DATA = {
  Florence: { avgADR: 350, occupancy: [72, 75, 80, 85, 82, 78], pricingBands: { budget: 120, mid: 250, luxury: 450 }, demand: 'High' },
  Rome: { avgADR: 280, occupancy: [68, 72, 76, 80, 78, 74], pricingBands: { budget: 100, mid: 200, luxury: 380 }, demand: 'High' },
  Milan: { avgADR: 260, occupancy: [65, 70, 73, 78, 75, 71], pricingBands: { budget: 90, mid: 180, luxury: 350 }, demand: 'Medium' },
  Venice: { avgADR: 320, occupancy: [60, 65, 75, 82, 80, 70], pricingBands: { budget: 110, mid: 220, luxury: 420 }, demand: 'Medium' },
  Genoa: { avgADR: 180, occupancy: [55, 60, 65, 70, 68, 62], pricingBands: { budget: 70, mid: 140, luxury: 260 }, demand: 'Low' },
};

export const MOCK_LEADERBOARD = [
  { rank: 1, hotelName: 'Starhotels President Genoa', score: 92 },
  { rank: 2, hotelName: 'Starhotels Helvetia & Bristol', score: 88 },
  { rank: 3, hotelName: 'Starhotels Michelangelo Rome', score: 75 },
  { rank: 4, hotelName: 'Starhotels Echo Milan', score: 62 },
  { rank: 5, hotelName: 'Grand Hotel Venezia', score: 45 },
];

export const MOCK_GOOGLE_PLACES = [
  { name: 'Hotel Bella Vista', address: 'Via Roma 42, Florence, Italy', coordinates: { lat: 43.77, lng: 11.25 }, phone: '+39 055 1234567' },
  { name: 'Grand Palace Hotel', address: 'Piazza del Duomo 5, Milan, Italy', coordinates: { lat: 45.46, lng: 9.19 }, phone: '+39 02 5551234' },
  { name: 'Marina Bay Resort', address: 'Corso Italia 28, Genoa, Italy', coordinates: { lat: 44.41, lng: 8.93 }, phone: '+39 010 2612641' },
  { name: 'Hotel Splendido', address: 'Via Roma 15, Florence, Italy', coordinates: { lat: 43.77, lng: 11.25 }, phone: '+39 055 1234567' },
  { name: 'Palazzo Luxury Hotel', address: 'Via Veneto 42, Rome, Italy', coordinates: { lat: 41.91, lng: 12.49 }, phone: '+39 06 9876543' },
  { name: 'Hotel Belvedere', address: 'Corso Buenos Aires 8, Milan, Italy', coordinates: { lat: 45.48, lng: 9.21 }, phone: '+39 02 5551234' },
  { name: 'Ca\' Sagredo Hotel', address: 'Campo Santa Sofia, Venice, Italy', coordinates: { lat: 45.44, lng: 12.33 }, phone: '+39 041 2413111' },
  { name: 'Hotel Continental', address: 'Via Balbi 33, Genoa, Italy', coordinates: { lat: 44.41, lng: 8.93 }, phone: '+39 010 2612641' },
];
