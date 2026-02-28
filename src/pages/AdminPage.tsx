import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Building2, CheckCircle, XCircle, Clock, Filter, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_HOTELS } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [hotels, setHotels] = useState(MOCK_HOTELS);

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
                    <td className="p-4 font-medium text-foreground">{hotel.name}</td>
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
    </div>
  );
};

export default AdminPage;
