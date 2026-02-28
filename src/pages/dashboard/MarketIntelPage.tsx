import { motion } from 'framer-motion';
import { MOCK_HOTELS, MOCK_MARKET_DATA } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Users, Signal } from 'lucide-react';

const MONTH_LABELS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

const MarketIntelPage = () => {
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => user?.hotels.includes(h.id)) || MOCK_HOTELS[0];
  const market = MOCK_MARKET_DATA[hotel.city as keyof typeof MOCK_MARKET_DATA] || MOCK_MARKET_DATA.Florence;

  const occupancyData = market.occupancy.map((v, i) => ({ month: MONTH_LABELS[i], occupancy: v }));
  const pricingData = [
    { segment: 'Budget', rate: market.pricingBands.budget },
    { segment: 'Mid-Range', rate: market.pricingBands.mid },
    { segment: 'Luxury', rate: market.pricingBands.luxury },
  ];

  const kpis = [
    { label: 'City Avg ADR', value: `€${market.avgADR}`, icon: DollarSign },
    { label: 'Demand Level', value: market.demand, icon: Signal },
    { label: 'Peak Occupancy', value: `${Math.max(...market.occupancy)}%`, icon: Users },
    { label: 'Your Position', value: hotel.rooms[0]?.baseRate > market.avgADR ? 'Above Avg' : 'Below Avg', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Market Intelligence — {hotel.city}</h1>
        <p className="text-sm text-muted-foreground">See how your property compares to the market</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl border border-border p-5">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-3">
              <kpi.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xl font-bold text-foreground">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Pricing Bands</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pricingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="segment" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketIntelPage;
