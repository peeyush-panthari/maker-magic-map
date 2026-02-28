import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Building2, CheckCircle, XCircle, Clock, Filter, LogOut, BarChart3, MapPin, Wifi, WifiOff, BedDouble, X, Camera, FileText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_HOTELS } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Hotel } from '@/data/types';

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [hotels, setHotels] = useState(MOCK_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const filtered = hotels.filter(h => filter === 'all' || h.starRating === parseInt(filter));

  const kpis = [
    { label: 'Active Properties', value: hotels.filter(h => h.onboardingStatus === 'completed').length, icon: Building2 },
    { label: 'Avg Content Score', value: Math.round(hotels.reduce((sum, h) => sum + h.contentScore, 0) / hotels.length), icon: BarChart3 },
    { label: 'CM Connected', value: `${Math.round(hotels.filter(h => h.channelManagerConnected).length / hotels.length * 100)}%`, icon: CheckCircle },
    { label: 'Avg Onboarding', value: '12 min', icon: Clock },
  ];

  const handleApprove = (id: string) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, onboardingStatus: 'completed' as const } : h));
    toast({ title: 'Hotel Approved', description: 'The property is now live on the platform.' });
  };

  const handleReject = (id: string) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, onboardingStatus: 'rejected' as const } : h));
    toast({ title: 'Hotel Rejected', variant: 'destructive' });
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-success/10 text-success',
      pending_approval: 'bg-warning/10 text-warning',
      in_progress: 'bg-info/10 text-info',
      rejected: 'bg-destructive/10 text-destructive',
    };
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || ''}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b border-border px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary fill-primary" />
          <span className="font-bold text-foreground">Starhotels Admin</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-5">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Hotels table */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Onboarded Hotels</h3>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[1,2,3,4,5].map(r => <SelectItem key={r} value={String(r)}>{r} Star{r > 1 ? 's' : ''}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Hotel</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">City</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Stars</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Content Score</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(hotel => (
                  <tr key={hotel.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedHotel(hotel)}
                        className="font-medium text-primary hover:underline text-left"
                      >
                        {hotel.name}
                      </button>
                    </td>
                    <td className="p-4 text-muted-foreground">{hotel.city}</td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: hotel.starRating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 text-primary fill-primary" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">{statusBadge(hotel.onboardingStatus)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${hotel.contentScore}%` }} />
                        </div>
                        <span className="text-foreground font-medium">{hotel.contentScore}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {hotel.onboardingStatus === 'pending_approval' && hotel.starRating >= 4 && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleApprove(hotel.id)} className="h-7 text-xs gap-1">
                            <CheckCircle className="h-3 w-3" /> Approve
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleReject(hotel.id)} className="h-7 text-xs gap-1 text-destructive">
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hotel Detail Dialog */}
      <Dialog open={!!selectedHotel} onOpenChange={(open) => !open && setSelectedHotel(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedHotel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  {selectedHotel.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: selectedHotel.starRating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                {statusBadge(selectedHotel.onboardingStatus)}
                <span className="text-xs text-muted-foreground">ID: {selectedHotel.propertyId}</span>
              </div>

              <Tabs defaultValue="basics" className="mt-4">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="basics">Basic Details</TabsTrigger>
                  <TabsTrigger value="rooms">Room Categories</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="kyc">KYC & Compliance</TabsTrigger>
                </TabsList>

                {/* Basic Details */}
                <TabsContent value="basics" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={selectedHotel.address} />
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="City" value={selectedHotel.city} />
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Coordinates" value={`${selectedHotel.coordinates.lat}, ${selectedHotel.coordinates.lng}`} />
                    <InfoRow
                      icon={selectedHotel.channelManagerConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                      label="Channel Manager"
                      value={selectedHotel.channelManagerConnected ? 'Connected' : 'Not Connected'}
                    />
                    <InfoRow icon={<BarChart3 className="h-4 w-4" />} label="Content Score" value={`${selectedHotel.contentScore}/100`} />
                    <InfoRow icon={<BedDouble className="h-4 w-4" />} label="Total Rooms" value={String(selectedHotel.rooms.reduce((s, r) => s + r.count, 0))} />
                  </div>
                </TabsContent>

                {/* Room Categories */}
                <TabsContent value="rooms" className="space-y-4 mt-4">
                  {selectedHotel.rooms.map(room => (
                    <div key={room.type} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{room.type}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{room.count} rooms</span>
                      </div>
                      <Separator className="my-3" />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Base Rate</span>
                          <p className="font-semibold text-foreground">€{room.baseRate}/night</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Room Count</span>
                          <p className="font-semibold text-foreground">{room.count}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category</span>
                          <p className="font-semibold text-foreground">{room.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Content */}
                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Hotel Description</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedHotel.description || <span className="italic">No description provided</span>}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <span className="font-medium text-foreground block mb-2">Amenities</span>
                    {selectedHotel.amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedHotel.amenities.map(a => (
                          <span key={a} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">{a}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No amenities listed</p>
                    )}
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Photos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedHotel.photos.length} photos uploaded</p>
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <span className="font-medium text-foreground block mb-2">Content Score</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${selectedHotel.contentScore}%` }} />
                      </div>
                      <span className="text-lg font-bold text-foreground">{selectedHotel.contentScore}</span>
                    </div>
                  </div>
                </TabsContent>

                {/* KYC */}
                <TabsContent value="kyc" className="space-y-4 mt-4">
                  <div className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">KYC Documents</span>
                    </div>
                    {[
                      { label: 'Government ID Proof', status: true },
                      { label: 'Tax Registration (GST/VAT)', status: true },
                      { label: 'Municipal License', status: selectedHotel.onboardingStatus === 'completed' },
                      { label: 'Additional Documents', status: selectedHotel.onboardingStatus === 'completed' },
                    ].map(doc => (
                      <div key={doc.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-foreground">{doc.label}</span>
                        {doc.status ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-success"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-medium text-warning"><Clock className="h-3.5 w-3.5" /> Pending</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-border p-4">
                    <span className="font-medium text-foreground block mb-2">Contract Status</span>
                    <div className="flex items-center gap-2">
                      {selectedHotel.onboardingStatus === 'completed' ? (
                        <span className="flex items-center gap-1 text-sm text-success"><CheckCircle className="h-4 w-4" /> Contract Signed & Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-warning"><Clock className="h-4 w-4" /> Contract Pending</span>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
    <div className="text-primary mt-0.5">{icon}</div>
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default AdminPage;
