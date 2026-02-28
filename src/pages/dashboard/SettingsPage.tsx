import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [whatsappNotif, setWhatsappNotif] = useState(true);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Profile</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Name</span><span className="text-foreground font-medium">{user?.name}</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Email</span><span className="text-foreground font-medium">{user?.email}</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Phone Number</span><span className="text-foreground font-medium">+1 (555) 123-4567</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/50"><span className="text-muted-foreground">Role</span><span className="text-foreground font-medium capitalize">{user?.role?.replace('_', ' ')}</span></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <h3 className="font-semibold text-foreground">Notification Preferences</h3>
        <div className="flex items-center justify-between">
          <Label>Email Notifications</Label>
          <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
        </div>
        <div className="flex items-center justify-between">
          <Label>SMS Notifications</Label>
          <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
        </div>
        <div className="flex items-center justify-between">
          <Label>WhatsApp Notifications</Label>
          <Switch checked={whatsappNotif} onCheckedChange={setWhatsappNotif} />
        </div>
      </div>

      <Button className="gradient-primary text-primary-foreground border-0"
        onClick={() => toast({ title: 'Settings Saved', description: 'Your preferences have been updated.' })}>
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsPage;
