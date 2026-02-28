import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Mail, Phone, ArrowRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const OnboardingCompletePage = () => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId') || 'SH-HTL-000';
  const { toast } = useToast();

  const copyPropertyId = () => {
    navigator.clipboard.writeText(propertyId);
    toast({ title: 'Copied!', description: 'Property ID copied to clipboard.' });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Star className="h-6 w-6 text-primary fill-primary" />
          <span className="font-bold text-foreground">Starhotels Onboarding</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          <h1 className="text-3xl font-bold text-foreground mb-3">Thank You!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You've completed the first major step to partner with <span className="font-semibold text-foreground">Starhotels</span>. We're excited to have you on board!
          </p>

          {/* Property ID */}
          <div className="bg-accent/50 rounded-xl p-5 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Your Unique Property ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-primary tracking-wider">{propertyId}</span>
              <Button variant="ghost" size="icon" onClick={copyPropertyId} className="h-8 w-8">
                <Copy className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Please use this ID in all future communications with our team.</p>
          </div>

          {/* What's Next */}
          <div className="text-left bg-muted/50 rounded-xl p-6 mb-8 space-y-4">
            <h3 className="font-semibold text-foreground">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-sm text-muted-foreground">Our partner team will review your submitted details, including property information, KYC documents, and contract.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-sm text-muted-foreground">You will receive a confirmation response within <span className="font-semibold text-foreground">3–5 business days</span> via email.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-sm text-muted-foreground">Once approved, your property will go live on the Starhotels platform and you'll get full access to the Extranet dashboard.</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted/50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-3">Have questions? Reach out to us</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:partners@starhotels.com" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Mail className="h-4 w-4" /> partners@starhotels.com
              </a>
              <a href="tel:+390551234567" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Phone className="h-4 w-4" /> +39 055 123 4567
              </a>
            </div>
          </div>

          <Link to="/">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 h-12 px-8">
              Go to Homepage <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingCompletePage;
