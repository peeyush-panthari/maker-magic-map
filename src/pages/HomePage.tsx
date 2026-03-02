import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Shield, Star, ArrowRight, BarChart3, Globe2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Building2, title: 'Easy Onboarding', desc: 'Get your property live in under 15 minutes with our guided setup.' },
  { icon: TrendingUp, title: 'Revenue Growth', desc: 'AI-powered pricing and market insights to maximize your revenue.' },
  { icon: Shield, title: 'Content Excellence', desc: 'Boost your visibility with our content quality engine.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track performance with detailed dashboards and benchmarks.' },
  { icon: Globe2, title: 'Channel Integration', desc: 'Seamlessly connect your existing channel managers.' },
  { icon: Zap, title: 'Smart Automation', desc: 'Automate rate updates, notifications, and more.' },
];

const stats = [
  { value: '20,000+', label: 'Partner Hotels' },
  { value: '12M+', label: 'Bookings Managed' },
  { value: '98%', label: 'Partner Satisfaction' },
  { value: '45+', label: 'Customers from 45+ Countries' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-7 w-7 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">Starhotels</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Partner Login</Button>
            </Link>
            <Link to="/login?mode=register">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-accent text-accent-foreground">
              Extranet 2.0 — Now Live
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
              Grow Your Hotel<br />
              <span className="text-primary">Business With Us</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of hotels across Europe on the Starhotels platform to reach Millions of travelers across Globe. Self-serve onboarding, powerful analytics, and AI-driven content tools — all in one place.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login?mode=register">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 h-12 px-8 text-base">
                  Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Partner Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-border bg-muted/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Partner With Starhotels?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to manage, grow, and optimize your hotel business.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center rounded-2xl gradient-primary p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join the Starhotels network today and unlock powerful tools to grow your business.
          </p>
          <Link to="/login?mode=register">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
              Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <span className="font-semibold text-foreground">Starhotels</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Starhotels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
