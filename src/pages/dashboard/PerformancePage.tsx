import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MOCK_HOTELS, MOCK_PERFORMANCE, MOCK_MARKET_DATA } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const MONTH_LABELS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

const PerformancePage = () => {
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => user?.hotels.includes(h.id)) || MOCK_HOTELS[0];
  const perf = MOCK_PERFORMANCE.find(p => p.hotelId === hotel.id) || MOCK_PERFORMANCE[0];
  const market = MOCK_MARKET_DATA[hotel.city as keyof typeof MOCK_MARKET_DATA];

  const revenueData = perf.monthlyRevenue.map((v, i) => ({ month: MONTH_LABELS[i], revenue: v / 1000 }));
  const bookingsData = perf.bookings.map((v, i) => ({ month: MONTH_LABELS[i], bookings: v }));
  const adrData = perf.ADR.map((v, i) => ({ month: MONTH_LABELS[i], adr: v, cityAvg: market?.avgADR || 250 }));

  const latestADR = perf.ADR[perf.ADR.length - 1];
  const cityAvg = market?.avgADR || 250;
  const adrDiff = ((latestADR - cityAvg) / cityAvg * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Performance Dashboard</h1>

      {market && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-accent border border-border">
          <p className="text-sm text-accent-foreground font-medium">
            📊 Your ADR is <span className="text-primary font-bold">{adrDiff}%</span> {Number(adrDiff) >= 0 ? 'above' : 'below'} the {hotel.city} city average (€{cityAvg})
          </p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Revenue Trend (€K)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bookings */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ADR Comparison */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">ADR vs City Average</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={adrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="adr" name="Your ADR" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))' }} />
              <Line type="monotone" dataKey="cityAvg" name="City Average" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default PerformancePage;
