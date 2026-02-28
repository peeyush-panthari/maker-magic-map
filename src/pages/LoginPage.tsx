import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isRegister) {
      // For register mode, redirect to onboarding after mock signup
      setTimeout(() => {
        setLoading(false);
        navigate('/onboarding');
      }, 1000);
      return;
    }

    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const stored = localStorage.getItem('starhotels_user');
      const user = stored ? JSON.parse(stored) : null;
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Try hotel@demo.com / password123',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-primary-foreground max-w-md"
        >
          <Star className="h-12 w-12 mb-6 fill-primary-foreground" />
          <h2 className="text-4xl font-bold mb-4">Welcome to Starhotels Extranet</h2>
          <p className="text-primary-foreground/80 text-lg">
            Manage your properties, optimize content, and grow your revenue — all from one powerful platform.
          </p>
          <div className="mt-8 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
            <p className="text-sm text-primary-foreground/70 font-medium">Demo Credentials</p>
            <p className="text-sm text-primary-foreground/90 mt-1">Hotel Manager: hotel@demo.com / password123</p>
            <p className="text-sm text-primary-foreground/90">Admin: admin@demo.com / password123</p>
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Star className="h-7 w-7 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">Starhotels</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isRegister ? 'Start your onboarding journey' : 'Access your hotel dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your full name" className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@hotel.com"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 h-11" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
          </div>

          <Button variant="outline" className="w-full h-11" onClick={() => toast({ title: 'Google SSO', description: 'Mock SSO — use email login for demo' })}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isRegister ? (
              <>Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Sign in</a></>
            ) : (
              <>Don't have an account? <a href="/login?mode=register" className="text-primary font-medium hover:underline">Become a partner</a></>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
