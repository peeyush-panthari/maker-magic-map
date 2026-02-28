import { motion } from 'framer-motion';
import { TrendingUp, CalendarCheck, DollarSign, XCircle, ArrowUpRight, Palette, Building2 } from 'lucide-react';
import { MOCK_HOTELS, MOCK_PERFORMANCE } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardHome = () => {
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => user?.hotels.includes(h.id)) || MOCK_HOTELS[0];
  const perf = MOCK_PERFORMANCE.find(p => p.hotelId === hotel.id) || MOCK_PERFORMANCE[0];
  const latestIdx = perf.monthlyRevenue.length - 1;

  const kpis = [
    { label: 'Monthly Revenue', value: `€${(perf.monthlyRevenue[latestIdx] / 1000).toFixed(0)}K`, change: '+7.5%', icon: DollarSign, positive: true },
    { label: 'Bookings', value: perf.bookings[latestIdx], change: '+12', icon: CalendarCheck, positive: true },
    { label: 'ADR', value: `€${perf.ADR[latestIdx]}`, change: '+2.3%', icon: TrendingUp, positive: true },
    { label: 'Cancellation Rate', value: `${perf.cancellationRate[latestIdx]}%`, change: '-1.2%', icon: XCircle, positive: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{hotel.name}</h1>
        <p className="text-sm text-muted-foreground">{hotel.address}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-success flex items-center gap-0.5">
                {kpi.change} <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Content Score + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6 flex items-center gap-6"
        >
          <div className="relative h-24 w-24 shrink-0">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                strokeDasharray={`${hotel.contentScore} 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">{hotel.contentScore}</span>
          </div>
          <div>
            <div className="font-semibold text-foreground">Content Score</div>
            <p className="text-sm text-muted-foreground mt-1">
              {hotel.contentScore >= 80 ? '🏆 Premium Partner' : 'Improve your content to unlock Premium status'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard/content">
              <Button variant="outline" className="w-full justify-start gap-2 h-11"><Palette className="h-4 w-4 text-primary" /> Update Content</Button>
            </Link>
            <Link to="/dashboard/rates">
              <Button variant="outline" className="w-full justify-start gap-2 h-11"><DollarSign className="h-4 w-4 text-primary" /> Manage Rates</Button>
            </Link>
            <Link to="/dashboard/performance">
              <Button variant="outline" className="w-full justify-start gap-2 h-11"><TrendingUp className="h-4 w-4 text-primary" /> View Performance</Button>
            </Link>
            <Link to="/dashboard/market">
              <Button variant="outline" className="w-full justify-start gap-2 h-11"><Building2 className="h-4 w-4 text-primary" /> Market Intel</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
