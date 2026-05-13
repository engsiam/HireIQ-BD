'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Calendar, User, Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/bookings', {
        propertyId: property.id,
        ...formData,
      });
      setSubmitted(true);
      toast.success('Booking request submitted successfully!');
    } catch {
      toast.error('Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-card border border-border rounded-3xl shadow-3xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-2xl font-black text-foreground">Book a <span className="text-primary italic">Consultation</span></h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-2xl font-black text-foreground">Request Submitted!</h4>
            <p className="text-muted-foreground">Our agent will contact you within 24 hours to schedule your consultation.</p>
            <Button onClick={onClose} className="bg-primary text-secondary-foreground font-black px-8 h-12 rounded-xl">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Booking for:</p>
              <p className="font-bold text-foreground">{property.title}</p>
              <p className="text-sm text-muted-foreground">{property.city}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Full Name</Label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="pl-11 h-12 bg-secondary border-border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Email</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="pl-11 h-12 bg-secondary border-border rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Phone Number</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1XXX XXXXXX"
                    className="pl-11 h-12 bg-secondary border-border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Preferred Date</Label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="pl-11 h-12 bg-secondary border-border rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Message (Optional)</Label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-4 top-4 text-muted-foreground" />
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any specific requirements or questions..."
                  className="pl-11 pt-3 bg-secondary border-border rounded-xl min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 rounded-xl border-border text-foreground font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-14 bg-primary text-secondary-foreground font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                {loading ? 'Submitting...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}