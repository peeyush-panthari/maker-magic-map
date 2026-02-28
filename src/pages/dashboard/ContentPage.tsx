import { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MOCK_HOTELS, MOCK_LEADERBOARD } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ALL_AMENITIES = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge', 'Room Service', 'Parking', 'Business Center', 'Laundry', 'Airport Shuttle'];

const ContentPage = () => {
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => user?.hotels.includes(h.id)) || MOCK_HOTELS[0];
  const { toast } = useToast();

  const [description, setDescription] = useState(hotel.description);
  const [amenities, setAmenities] = useState<string[]>(hotel.amenities);
  const [photos, setPhotos] = useState<string[]>([]);

  const generateDescription = () => {
    setDescription(`Welcome to ${hotel.name}, a stunning ${hotel.starRating}-star property located in ${hotel.city}. Guests enjoy world-class ${amenities.slice(0, 3).join(', ')} and more. Experience unforgettable luxury at ${hotel.address}.`);
    toast({ title: 'AI Description Generated', description: 'You can edit it to your liking.' });
  };

  const contentScore = () => {
    let score = 0;
    if (hotel.name && hotel.address) score += 20;
    if (photos.length >= 10) score += 30;
    else if (photos.length > 0) score += photos.length * 3;
    if (description) score += 10;
    if (amenities.length >= 5) score += 20;
    else if (amenities.length > 0) score += amenities.length * 4;
    score += 20; // tagged photos bonus mock
    return Math.min(score, 100);
  };

  const handlePhotoDrop = () => {
    const newPhotos = ['room_photo_1.jpg', 'pool_view.jpg', 'spa_interior.jpg', 'lobby.jpg', 'restaurant_main.jpg'];
    setPhotos(prev => [...prev, ...newPhotos]);
    toast({ title: 'Photos uploaded', description: `${newPhotos.length} photos added with AI tags` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Content Management</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
            <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
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
            <h3 className="font-semibold text-foreground mb-3">Photos ({photos.length})</h3>
            <div onClick={handlePhotoDrop} className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <p className="text-muted-foreground text-sm">Click to upload photos (mock upload)</p>
            </div>
            {photos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {photos.map((p, i) => {
                  const tag = p.includes('room') ? 'Room' : p.includes('pool') ? 'Pool' : p.includes('spa') ? 'Spa' : 'General';
                  return (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium">
                      📷 {p} — <span className="text-primary">{tag}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Content Score</h3>
            <div className="flex justify-center mb-4">
              <div className="relative h-28 w-28">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                    strokeDasharray={`${contentScore()} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">{contentScore()}</span>
              </div>
            </div>
            {contentScore() >= 80 && (
              <div className="text-center p-3 rounded-lg bg-accent">
                <Trophy className="h-5 w-5 text-primary mx-auto mb-1" />
                <span className="text-sm font-medium text-accent-foreground">Premium Partner</span>
              </div>
            )}
          </motion.div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Leaderboard</h3>
            <div className="space-y-2">
              {MOCK_LEADERBOARD.map(entry => (
                <div key={entry.rank} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {entry.rank}
                    </span>
                    <span className="text-foreground truncate">{entry.hotelName}</span>
                  </div>
                  <span className="font-medium text-foreground">{entry.score}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Button className="gradient-primary text-primary-foreground border-0" onClick={() => toast({ title: 'Content Saved', description: 'Your changes have been saved successfully.' })}>
        Save Changes
      </Button>
    </div>
  );
};

export default ContentPage;
