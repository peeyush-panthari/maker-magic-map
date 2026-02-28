import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_HOTELS } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Save } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_IN_MONTH = 30;

const RatesPage = () => {
  const { user } = useAuth();
  const hotel = MOCK_HOTELS.find(h => user?.hotels.includes(h.id)) || MOCK_HOTELS[0];
  const { toast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [rates, setRates] = useState<Record<string, Record<number, number>>>(() => {
    const initial: Record<string, Record<number, number>> = {};
    hotel.rooms.forEach(room => {
      initial[room.type] = {};
      for (let d = 1; d <= DAYS_IN_MONTH; d++) {
        initial[room.type][d] = room.baseRate + Math.floor(Math.random() * 40 - 20);
      }
    });
    return initial;
  });

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [bulkRate, setBulkRate] = useState('');
  const [bulkRoomType, setBulkRoomType] = useState(hotel.rooms[0]?.type || '');

  const toggleDay = (day: number) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const applyBulkRate = () => {
    const rate = parseInt(bulkRate);
    if (!rate || rate < 0) {
      toast({ title: 'Invalid Rate', description: 'Rate must be a positive number', variant: 'destructive' });
      return;
    }
    setRates(prev => {
      const updated = { ...prev, [bulkRoomType]: { ...prev[bulkRoomType] } };
      selectedDays.forEach(d => { updated[bulkRoomType][d] = rate; });
      return updated;
    });
    setSelectedDays([]);
    setBulkRate('');
    toast({ title: 'Rates Updated', description: `${selectedDays.length} days updated for ${bulkRoomType}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Rate Calendar</h1>
        {hotel.channelManagerConnected && (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-success/10 text-success">CM Synced</span>
        )}
      </div>

      {/* Month selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setSelectedMonth(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              i === selectedMonth ? 'gradient-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}>{m} 2026</button>
        ))}
      </div>

      {/* Bulk update */}
      {selectedDays.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-accent rounded-xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-accent-foreground">{selectedDays.length} days selected</span>
          <select value={bulkRoomType} onChange={e => setBulkRoomType(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card text-foreground">
            {hotel.rooms.map(r => <option key={r.type} value={r.type}>{r.type}</option>)}
          </select>
          <Input value={bulkRate} onChange={e => setBulkRate(e.target.value)} type="number" placeholder="New rate €" className="w-32 h-9" />
          <Button size="sm" onClick={applyBulkRate} className="gradient-primary text-primary-foreground border-0">Apply</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedDays([])}>Clear</Button>
        </motion.div>
      )}

      {/* Calendar grid */}
      {hotel.rooms.map(room => (
        <motion.div key={room.type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">{room.type}</h3>
            <span className="text-xs text-muted-foreground">Base: €{room.baseRate}</span>
          </div>
          <div className="grid grid-cols-7 md:grid-cols-10 gap-1.5">
            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map(day => {
              const rate = rates[room.type]?.[day] ?? room.baseRate;
              const isSelected = selectedDays.includes(day);
              return (
                <button key={day} onClick={() => toggleDay(day)}
                  className={`p-2 rounded-lg text-center text-xs transition-colors border ${
                    isSelected ? 'border-primary bg-accent' : 'border-border hover:border-primary/30'
                  }`}>
                  <div className="text-muted-foreground">{day}</div>
                  <div className="font-semibold text-foreground">€{rate}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}

      <Button className="gradient-primary text-primary-foreground border-0 gap-2"
        onClick={() => toast({ title: 'Rates Saved', description: 'All rate changes have been saved.' })}>
        <Save className="h-4 w-4" /> Save All Rates
      </Button>
    </div>
  );
};

export default RatesPage;
