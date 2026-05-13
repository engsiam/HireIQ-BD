'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Bell, Lock, Globe } from 'lucide-react';

export default function EmployerSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newApplications: true,
    weeklyDigest: false,
  });

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Settings saved successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/50 text-sm">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardHeader className="border-b border-white/5 pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Email Alerts</Label>
                <p className="text-white/50 text-sm">Receive email notifications for important updates</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">New Applications</Label>
                <p className="text-white/50 text-sm">Get notified when you receive new applications</p>
              </div>
              <Switch
                checked={notifications.newApplications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newApplications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Weekly Digest</Label>
                <p className="text-white/50 text-sm">Receive a weekly summary of your activity</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardHeader className="border-b border-white/5 pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Current Password</Label>
              <Input
                type="password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">New Password</Label>
              <Input
                type="password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Confirm New Password</Label>
              <Input
                type="password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                placeholder="Confirm new password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#EB4C4C] hover:bg-[#FF7070]"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}