import { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MOCK_HOTELS, MOCK_LEADERBOARD } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Trophy, BedDouble, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ALL_AMENITIES = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge', 'Room Service', 'Parking', 'Business Center', 'Laundry', 'Airport Shuttle'];
const ROOM_AMENITIES = ['Air Conditioning', 'Mini Bar', 'Safe', 'TV', 'Balcony', 'Coffee Maker', 'Bathrobe', 'Hair Dryer', 'Iron', 'Desk'];

const ContentPage = () => {
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => user?.hotels.includes(h.id)) || MOCK_HOTELS[0];
  const { toast } = useToast();

  const [description, setDescription] = useState(hotel.description);
  const [amenities, setAmenities] = useState<string[]>(hotel.amenities);
  const [photos, setPhotos] = useState<string[]>([]);

  // Room-level state
  const [roomDescriptions, setRoomDescriptions] = useState<Record<string, string>>(
    Object.fromEntries(hotel.rooms.map(r => [r.type, `A comfortable ${r.type} room at ${hotel.name}.`]))
  );
  const [roomAmenities, setRoomAmenities] = useState<Record<string, string[]>>(
    Object.fromEntries(hotel.rooms.map(r => [r.type, ['Air Conditioning', 'TV', 'WiFi']]))
  );
  const [roomPhotos, setRoomPhotos] = useState<Record<string, string[]>>(
    Object.fromEntries(hotel.rooms.map(r => [r.type, []]))
  );

  const generateDescription = () => {
    setDescription(`Welcome to ${hotel.name}, a stunning ${hotel.starRating}-star property located in ${hotel.city}. Guests enjoy world-class ${amenities.slice(0, 3).join(', ')} and more. Experience unforgettable luxury at ${hotel.address}.`);
    toast({ title: 'AI Description Generated', description: 'You can edit it to your liking.' });
  };

  const generateRoomDescription = (roomType: string) => {
    setRoomDescriptions(prev => ({
      ...prev,
      [roomType]: `Experience our beautifully appointed ${roomType} room at ${hotel.name}. Featuring modern amenities including ${(roomAmenities[roomType] || []).slice(0, 3).join(', ')}, this room offers the perfect blend of comfort and style in the heart of ${hotel.city}.`
    }));
    toast({ title: 'AI Room Description Generated' });
  };

  const contentScore = () => {
    let score = 0;
    if (hotel.name && hotel.address) score += 20;
    if (photos.length >= 10) score += 30;
    else if (photos.length > 0) score += photos.length * 3;
    if (description) score += 10;
    if (amenities.length >= 5) score += 20;
    else if (amenities.length > 0) score += amenities.length * 4;
    score += 20;
    return Math.min(score, 100);
  };

  const handlePhotoDrop = () => {
    const newPhotos = ['lobby.jpg', 'pool_view.jpg', 'spa_interior.jpg', 'restaurant_main.jpg', 'exterior.jpg'];
    setPhotos(prev => [...prev, ...newPhotos]);
    toast({ title: 'Photos uploaded', description: `${newPhotos.length} photos added with AI tags` });
  };

  const handleRoomPhotoDrop = (roomType: string) => {
    const newPhotos = [`${roomType.toLowerCase().replace(/\s/g, '_')}_1.jpg`, `${roomType.toLowerCase().replace(/\s/g, '_')}_2.jpg`, `${roomType.toLowerCase().replace(/\s/g, '_')}_3.jpg`];
    setRoomPhotos(prev => ({ ...prev, [roomType]: [...(prev[roomType] || []), ...newPhotos] }));
    toast({ title: 'Room photos uploaded', description: `${newPhotos.length} photos added for ${roomType}` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Content Management</h1>

      {/* Content Score at Top */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeDasharray={`${contentScore()} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">{contentScore()}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Content Score</h3>
              <p className="text-sm text-muted-foreground">Improve your score to rank higher in search results</p>
              {contentScore() >= 80 && (
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-medium">Premium Partner</span>
                </div>
              )}
            </div>
          </div>
          <div className="md:ml-auto">
            <h4 className="font-medium text-foreground text-sm mb-2">Leaderboard</h4>
            <div className="space-y-1">
              {MOCK_LEADERBOARD.slice(0, 3).map(entry => (
                <div key={entry.rank} className="flex items-center gap-2 text-sm">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {entry.rank}
                  </span>
                  <span className="text-foreground truncate max-w-[140px]">{entry.hotelName}</span>
                  <span className="font-medium text-muted-foreground">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs: Hotel Content & Room Content */}
      <Tabs defaultValue="hotel" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hotel" className="gap-1.5"><Building2 className="h-4 w-4" /> Hotel Content</TabsTrigger>
          <TabsTrigger value="rooms" className="gap-1.5"><BedDouble className="h-4 w-4" /> Room Content</TabsTrigger>
        </TabsList>

        {/* Hotel Content Tab */}
        <TabsContent value="hotel" className="space-y-6">
          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Hotel Description</h3>
              <Button variant="ghost" size="sm" onClick={generateDescription} className="text-primary gap-1">
                <Sparkles className="h-4 w-4" /> Generate with AI
              </Button>
            </div>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[120px]" placeholder="Describe your hotel..." />
          </motion.div>

          {/* Amenities */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-3">Hotel Amenities</h3>
            <div className="grid grid-cols-3 gap-3">
              {ALL_AMENITIES.map(a => (
                <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={amenities.includes(a)} onCheckedChange={checked => setAmenities(prev => checked ? [...prev, a] : prev.filter(x => x !== a))} />
                  {a}
                </label>
              ))}
            </div>
          </motion.div>

          {/* Photos */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-3">Hotel Photos ({photos.length})</h3>
            <div onClick={handlePhotoDrop} className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <p className="text-muted-foreground text-sm">Click to upload photos (mock upload)</p>
            </div>
            {photos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {photos.map((p, i) => {
                  const tag = p.includes('pool') ? 'Pool' : p.includes('spa') ? 'Spa' : p.includes('lobby') ? 'Lobby' : p.includes('restaurant') ? 'Restaurant' : 'Exterior';
                  return (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium">
                      📷 {p} — <span className="text-primary">{tag}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <Button className="gradient-primary text-primary-foreground border-0" onClick={() => toast({ title: 'Hotel Content Saved' })}>
            Save Hotel Content
          </Button>
        </TabsContent>

        {/* Room Content Tab */}
        <TabsContent value="rooms" className="space-y-6">
          {hotel.rooms.map((room, ri) => (
            <motion.div key={room.type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ri * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <BedDouble className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground text-lg">{room.type}</h3>
                <span className="text-sm text-muted-foreground">({room.count} rooms)</span>
              </div>

              {/* Room Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">Room Description</h4>
                  <Button variant="ghost" size="sm" onClick={() => generateRoomDescription(room.type)} className="text-primary gap-1 text-xs">
                    <Sparkles className="h-3 w-3" /> Generate with AI
                  </Button>
                </div>
                <Textarea
                  value={roomDescriptions[room.type] || ''}
                  onChange={e => setRoomDescriptions(prev => ({ ...prev, [room.type]: e.target.value }))}
                  className="min-h-[80px]"
                  placeholder={`Describe your ${room.type} room...`}
                />
              </div>

              {/* Room Amenities */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Room Amenities</h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {ROOM_AMENITIES.map(a => (
                    <label key={a} className="flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox
                        checked={(roomAmenities[room.type] || []).includes(a)}
                        onCheckedChange={checked => setRoomAmenities(prev => ({
                          ...prev,
                          [room.type]: checked
                            ? [...(prev[room.type] || []), a]
                            : (prev[room.type] || []).filter(x => x !== a)
                        }))}
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Photos */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Room Photos ({(roomPhotos[room.type] || []).length})</h4>
                <div onClick={() => handleRoomPhotoDrop(room.type)} className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                  <p className="text-muted-foreground text-xs">Click to upload {room.type} photos (mock)</p>
                </div>
                {(roomPhotos[room.type] || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(roomPhotos[room.type] || []).map((p, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium">
                        📷 {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          <Button className="gradient-primary text-primary-foreground border-0" onClick={() => toast({ title: 'Room Content Saved' })}>
            Save Room Content
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPage;
