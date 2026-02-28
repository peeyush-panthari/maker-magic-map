import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, ArrowRight, Check, Building2, BedDouble, FileText, Upload, Wifi, Palette, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MOCK_GOOGLE_PLACES } from '@/data/mockData';
import { Room } from '@/data/types';

const STEPS = [
  { icon: Building2, label: 'Hotel Basics' },
  { icon: BedDouble, label: 'Room Details' },
  { icon: FileText, label: 'Contract' },
  { icon: Upload, label: 'KYC Upload' },
  { icon: Wifi, label: 'Channel Manager' },
  { icon: Palette, label: 'Content Setup' },
  { icon: Send, label: 'Review & Submit' },
];

const ALL_AMENITIES = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge', 'Room Service', 'Parking', 'Business Center', 'Laundry', 'Airport Shuttle'];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [starRating, setStarRating] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [suggestions, setSuggestions] = useState<typeof MOCK_GOOGLE_PLACES>([]);

  // Step 2
  const [rooms, setRooms] = useState<Room[]>([
    { type: 'Standard', count: 0, baseRate: 0 },
    { type: 'Deluxe Sea View', count: 0, baseRate: 0 },
    { type: 'Junior Suite', count: 0, baseRate: 0 },
    { type: 'Presidential Suite', count: 0, baseRate: 0 },
  ]);

  // Step 3
  const [contractAccepted, setContractAccepted] = useState(false);

  // Step 4
  const [kycUploads, setKycUploads] = useState({ idProof: false, taxId: false, municipal: false, additional: false });
  const [kycLoading, setKycLoading] = useState('');

  // Step 5
  const [cmProvider, setCmProvider] = useState('');
  const [cmApiKey, setCmApiKey] = useState('');
  const [cmConnected, setCmConnected] = useState(false);

  // Step 6
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleHotelSearch = (val: string) => {
    setHotelName(val);
    if (val.length > 2) {
      setSuggestions(MOCK_GOOGLE_PLACES.filter(p =>
        p.name.toLowerCase().includes(val.toLowerCase()) ||
        p.address.toLowerCase().includes(val.toLowerCase())
      ));
    } else {
      setSuggestions([]);
    }
  };

  const selectPlace = (place: typeof MOCK_GOOGLE_PLACES[0]) => {
    setHotelName(place.name);
    setAddress(place.address);
    setPhone(place.phone);
    setCoordinates(place.coordinates);
    setSuggestions([]);
    toast({ title: 'Hotel Found!', description: `Auto-filled details for ${place.name}` });
  };

  const handleKycUpload = (field: keyof typeof kycUploads) => {
    setKycLoading(field);
    setTimeout(() => {
      setKycUploads(prev => ({ ...prev, [field]: true }));
      setKycLoading('');
    }, 2000);
  };

  const handleCmConnect = () => {
    if (cmApiKey.length > 5) {
      setCmConnected(true);
      toast({ title: 'Connected!', description: `Successfully connected to ${cmProvider}` });
    } else {
      toast({ title: 'Connection Failed', description: 'API key must be longer than 5 characters', variant: 'destructive' });
    }
  };

  const generateDescription = () => {
    const rating = starRating ? `${starRating}-star` : 'luxury';
    setDescription(`Welcome to ${hotelName || 'our hotel'}, a ${rating} property offering exceptional hospitality and modern amenities. ${amenities.length > 0 ? `Guests enjoy ${amenities.slice(0, 3).join(', ')}, and more.` : ''} Located at ${address || 'a prime location'}, we provide an unforgettable experience for every traveler.`);
  };

  const completionPct = () => {
    let score = 0;
    if (hotelName && address) score += 15;
    if (rooms.some(r => r.count > 0)) score += 15;
    if (contractAccepted) score += 15;
    if (Object.values(kycUploads).some(v => v)) score += 15;
    if (cmConnected) score += 10;
    if (description) score += 15;
    if (amenities.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const handleSubmit = () => {
    const propId = `SH-${(hotelName || 'HTL').substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    toast({ title: '🎉 Onboarding Complete!', description: `Property ID: ${propId}. Welcome to Starhotels!` });
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const updateRoom = (index: number, field: 'count' | 'baseRate', value: number) => {
    setRooms(prev => prev.map((r, i) => i === index ? { ...r, [field]: Math.max(0, value) } : r));
  };

  const next = () => setStep(s => Math.min(s + 1, 6));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Star className="h-6 w-6 text-primary fill-primary" />
          <span className="font-bold text-foreground">Starhotels Onboarding</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center flex-1">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i < step ? 'bg-primary text-primary-foreground' :
                  i === step ? 'gradient-primary text-primary-foreground shadow-md' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`text-xs mt-1.5 hidden md:block ${i === step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${((step) / 6) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card rounded-xl border border-border p-6 md:p-8"
          >
            {/* Step 0: Hotel Basics */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Hotel Basics</h2>

                {/* Google Places Search Bar */}
                <div className="rounded-xl border-2 border-primary/20 bg-accent/30 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Search Your Hotel (Google Places)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Start typing your hotel name to auto-fill all details below</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={hotelName}
                      onChange={e => handleHotelSearch(e.target.value)}
                      placeholder="e.g. Hotel Splendido, Palazzo Luxury Hotel..."
                      className="pl-10 h-11 bg-card"
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg">
                        {suggestions.map(s => (
                          <button key={s.name} onClick={() => selectPlace(s)} className="w-full text-left px-4 py-3 hover:bg-accent text-sm text-foreground border-b border-border last:border-0">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary shrink-0" />
                              <div>
                                <span className="font-medium">{s.name}</span>
                                <span className="text-muted-foreground block text-xs">{s.address}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto-filled fields */}
                <div className="space-y-4">
                  <div>
                    <Label>Hotel Name</Label>
                    <Input value={hotelName} onChange={e => setHotelName(e.target.value)} className="mt-1.5" placeholder="Hotel name" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={address} onChange={e => setAddress(e.target.value)} className="mt-1.5" placeholder="Auto-filled from search" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1.5" placeholder="+39 ..." /></div>
                    <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" type="email" placeholder="info@hotel.com" /></div>
                  </div>
                  <div>
                    <Label>Star Rating</Label>
                    <Select value={starRating} onValueChange={setStarRating}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select rating" /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5].map(r => <SelectItem key={r} value={String(r)}>{r} Star{r > 1 ? 's' : ''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {coordinates.lat !== 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        <Input value={coordinates.lat} readOnly className="mt-1.5 bg-muted/50 text-muted-foreground" />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input value={coordinates.lng} readOnly className="mt-1.5 bg-muted/50 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Rooms */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Room Details</h2>
                {rooms.map((room, i) => (
                  <div key={room.type} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="flex-1"><span className="font-medium text-foreground">{room.type}</span></div>
                    <div className="w-28">
                      <Label className="text-xs">Count</Label>
                      <Input type="number" value={room.count || ''} onChange={e => updateRoom(i, 'count', parseInt(e.target.value) || 0)} className="mt-1" />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Base Rate (€)</Label>
                      <Input type="number" value={room.baseRate || ''} onChange={e => updateRoom(i, 'baseRate', parseInt(e.target.value) || 0)} className="mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Contract */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Contract Signing</h2>
                <div className="p-4 rounded-lg bg-muted/50 border border-border max-h-48 overflow-y-auto text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Starhotels Partner Agreement</p>
                  <p>This Agreement is entered into between Starhotels S.p.A. and the Hotel Partner. By accepting these terms, the Hotel Partner agrees to list their property on the Starhotels platform, maintain content quality standards, and adhere to the pricing and availability guidelines set forth herein. The partnership includes access to the Starhotels Extranet, marketing support, and channel distribution services. Either party may terminate this agreement with 30 days written notice.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="accept" checked={contractAccepted} onCheckedChange={(v) => setContractAccepted(!!v)} />
                  <Label htmlFor="accept">I have read and accept the Terms & Conditions</Label>
                </div>
              </div>
            )}

            {/* Step 3: KYC */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">KYC Upload</h2>
                {(['idProof', 'taxId', 'municipal', 'additional'] as const).map(field => (
                  <div key={field} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <span className="font-medium text-foreground capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                    {kycUploads[field] ? (
                      <span className="flex items-center gap-1 text-success text-sm font-medium"><Check className="h-4 w-4" /> Verified</span>
                    ) : kycLoading === field ? (
                      <span className="text-sm text-muted-foreground animate-pulse">Validating...</span>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleKycUpload(field)}>Upload</Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Channel Manager */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Channel Manager Connection</h2>
                <div>
                  <Label>Provider</Label>
                  <Select value={cmProvider} onValueChange={setCmProvider}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SiteMinder">SiteMinder</SelectItem>
                      <SelectItem value="RateTiger">RateTiger</SelectItem>
                      <SelectItem value="Vertical Booking">Vertical Booking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input value={cmApiKey} onChange={e => setCmApiKey(e.target.value)} className="mt-1.5" placeholder="Enter your API key" />
                </div>
                {cmConnected ? (
                  <div className="flex items-center gap-2 text-success font-medium"><Check className="h-5 w-5" /> Connected to {cmProvider}</div>
                ) : (
                  <Button onClick={handleCmConnect} disabled={!cmProvider} className="gradient-primary text-primary-foreground border-0">Connect</Button>
                )}
                <p className="text-xs text-muted-foreground">You can skip this step and enter rates manually later.</p>
              </div>
            )}

            {/* Step 5: Content */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Initial Content Setup</h2>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Hotel Description</Label>
                    <Button variant="ghost" size="sm" onClick={generateDescription} className="text-primary">Generate with AI</Button>
                  </div>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1.5 min-h-[100px]" placeholder="Describe your hotel..." />
                </div>
                <div>
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {ALL_AMENITIES.map(a => (
                      <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={amenities.includes(a)}
                          onCheckedChange={checked => {
                            setAmenities(prev => checked ? [...prev, a] : prev.filter(x => x !== a));
                          }}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-foreground">Review & Submit</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-20 w-20">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                        strokeDasharray={`${completionPct()} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">{completionPct()}%</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Completion Score</div>
                    <div className="text-sm text-muted-foreground">Complete all sections for the best results</div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Hotel Name</span><span className="font-medium text-foreground">{hotelName || '—'}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Address</span><span className="font-medium text-foreground">{address || '—'}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Star Rating</span><span className="font-medium text-foreground">{starRating ? `${starRating} Stars` : '—'}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Rooms Configured</span><span className="font-medium text-foreground">{rooms.filter(r => r.count > 0).length} types</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Contract</span><span className="font-medium text-foreground">{contractAccepted ? '✓ Accepted' : '✗ Pending'}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">KYC Documents</span><span className="font-medium text-foreground">{Object.values(kycUploads).filter(Boolean).length}/4 uploaded</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Channel Manager</span><span className="font-medium text-foreground">{cmConnected ? `✓ ${cmProvider}` : 'Not connected'}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Amenities</span><span className="font-medium text-foreground">{amenities.length} selected</span></div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {step < 6 ? (
            <Button onClick={next} className="gradient-primary text-primary-foreground border-0">
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground border-0">
              Submit Onboarding <Send className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
