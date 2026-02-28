import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Star, Home, Palette, DollarSign, BarChart3, Globe2, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home', end: true },
  { to: '/dashboard/content', icon: Palette, label: 'Content' },
  { to: '/dashboard/rates', icon: DollarSign, label: 'Rates' },
  { to: '/dashboard/performance', icon: BarChart3, label: 'Performance' },
  { to: '/dashboard/market', icon: Globe2, label: 'Market Intel' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.userId === user?.id && !n.readStatus).length;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 lg:static",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <Star className="h-6 w-6 text-primary fill-primary" />
          <span className="font-bold text-foreground">Starhotels</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground"><Menu className="h-5 w-5" /></button>
          <div className="text-sm text-muted-foreground hidden lg:block">Welcome back, <span className="text-foreground font-medium">{user?.name}</span></div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="p-3 border-b border-border font-semibold text-sm text-foreground">Notifications</div>
                  {MOCK_NOTIFICATIONS.filter(n => n.userId === user?.id).map(n => (
                    <div key={n.id} className={cn('p-3 text-sm border-b border-border last:border-0', !n.readStatus && 'bg-accent/30')}>
                      <p className="text-foreground">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" />}
    </div>
  );
};

export default DashboardLayout;
