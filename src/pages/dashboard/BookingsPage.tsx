import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type BookingStatus = 'Confirmed' | 'Cancelled' | 'Checked Out';

interface Booking {
  id: string;
  customerName: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  price: number;
  status: BookingStatus;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK-001', customerName: 'Marco Rossi', roomType: 'Deluxe Sea View', checkIn: new Date('2026-03-10'), checkOut: new Date('2026-03-14'), price: 1280, status: 'Confirmed' },
  { id: 'BK-002', customerName: 'Elena Fischer', roomType: 'Junior Suite', checkIn: new Date('2026-03-05'), checkOut: new Date('2026-03-08'), price: 1350, status: 'Confirmed' },
  { id: 'BK-003', customerName: 'James Carter', roomType: 'Standard', checkIn: new Date('2026-02-20'), checkOut: new Date('2026-02-23'), price: 540, status: 'Checked Out' },
  { id: 'BK-004', customerName: 'Sophie Laurent', roomType: 'Presidential Suite', checkIn: new Date('2026-03-15'), checkOut: new Date('2026-03-20'), price: 6000, status: 'Confirmed' },
  { id: 'BK-005', customerName: 'Hiroshi Tanaka', roomType: 'Deluxe Sea View', checkIn: new Date('2026-02-10'), checkOut: new Date('2026-02-13'), price: 960, status: 'Checked Out' },
  { id: 'BK-006', customerName: 'Maria Garcia', roomType: 'Standard', checkIn: new Date('2026-02-25'), checkOut: new Date('2026-02-28'), price: 540, status: 'Cancelled' },
  { id: 'BK-007', customerName: 'Luca Bianchi', roomType: 'Junior Suite', checkIn: new Date('2026-04-01'), checkOut: new Date('2026-04-05'), price: 1800, status: 'Confirmed' },
  { id: 'BK-008', customerName: 'Anna Müller', roomType: 'Standard', checkIn: new Date('2026-01-15'), checkOut: new Date('2026-01-18'), price: 540, status: 'Checked Out' },
  { id: 'BK-009', customerName: 'Oliver Smith', roomType: 'Deluxe Sea View', checkIn: new Date('2026-03-22'), checkOut: new Date('2026-03-26'), price: 1280, status: 'Confirmed' },
  { id: 'BK-010', customerName: 'Priya Sharma', roomType: 'Junior Suite', checkIn: new Date('2026-02-01'), checkOut: new Date('2026-02-04'), price: 1350, status: 'Cancelled' },
  { id: 'BK-011', customerName: 'Chen Wei', roomType: 'Presidential Suite', checkIn: new Date('2026-01-20'), checkOut: new Date('2026-01-25'), price: 6000, status: 'Checked Out' },
  { id: 'BK-012', customerName: 'Emily Johnson', roomType: 'Standard', checkIn: new Date('2026-04-10'), checkOut: new Date('2026-04-13'), price: 540, status: 'Confirmed' },
];

const MONTHS = [
  'All Months', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const BookingsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('0');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return MOCK_BOOKINGS.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (monthFilter !== '0' && b.checkIn.getMonth() + 1 !== parseInt(monthFilter)) return false;
      if (dateFilter && format(b.checkIn, 'yyyy-MM-dd') !== format(dateFilter, 'yyyy-MM-dd')) return false;
      if (searchQuery && !b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) && !b.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.checkIn.getTime() - a.checkIn.getTime());
  }, [statusFilter, monthFilter, dateFilter, searchQuery]);

  const statusBadge = (status: BookingStatus) => {
    const styles: Record<BookingStatus, string> = {
      'Confirmed': 'bg-success/10 text-success',
      'Cancelled': 'bg-destructive/10 text-destructive',
      'Checked Out': 'bg-muted text-muted-foreground',
    };
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>;
  };

  const stats = {
    total: MOCK_BOOKINGS.length,
    confirmed: MOCK_BOOKINGS.filter(b => b.status === 'Confirmed').length,
    cancelled: MOCK_BOOKINGS.filter(b => b.status === 'Cancelled').length,
    checkedOut: MOCK_BOOKINGS.filter(b => b.status === 'Checked Out').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Bookings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'text-foreground' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-success' },
          { label: 'Checked Out', value: stats.checkedOut, color: 'text-muted-foreground' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-destructive' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" /> Filters:
          </div>

          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or ID..."
              className="pl-9 h-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Checked Out">Checked Out</SelectItem>
            </SelectContent>
          </Select>

          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Month" /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 gap-2", !dateFilter && "text-muted-foreground")}>
                <CalendarIcon className="h-4 w-4" />
                {dateFilter ? format(dateFilter, 'PPP') : 'Check-in date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          {(statusFilter !== 'all' || monthFilter !== '0' || dateFilter || searchQuery) && (
            <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => { setStatusFilter('all'); setMonthFilter('0'); setDateFilter(undefined); setSearchQuery(''); }}>
              Clear Filters
            </Button>
          )}
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-muted-foreground font-medium">Booking ID</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Room Type</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Check-in</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Check-out</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Price</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings match your filters.</td></tr>
              ) : (
                filtered.map(booking => (
                  <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="p-4 font-medium text-primary">{booking.id}</td>
                    <td className="p-4 text-foreground font-medium">{booking.customerName}</td>
                    <td className="p-4 text-muted-foreground">{booking.roomType}</td>
                    <td className="p-4 text-foreground">{format(booking.checkIn, 'dd MMM yyyy')}</td>
                    <td className="p-4 text-foreground">{format(booking.checkOut, 'dd MMM yyyy')}</td>
                    <td className="p-4 text-foreground font-medium">€{booking.price.toLocaleString()}</td>
                    <td className="p-4">{statusBadge(booking.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border text-xs text-muted-foreground">
          Showing {filtered.length} of {MOCK_BOOKINGS.length} bookings
        </div>
      </motion.div>
    </div>
  );
};

export default BookingsPage;
