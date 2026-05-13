'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Input } from '@/components/ui/input';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await axiosInstance.post('/contact', {
        name: 'Newsletter Subscriber',
        email,
        subject: 'Newsletter Subscription',
        message: 'I want to subscribe to the HireIQ BD newsletter.',
      });
      toast.success('Welcome aboard! Stay tuned for job updates and career tips.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="bg-[#FFEDC7] dark:bg-[#111827] border-t border-border/50" padding="none">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Mail size={36} />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Get the Latest <span className="text-primary italic">Jobs</span> in Your Inbox
              </h2>
              <p className="text-muted-foreground text-base font-medium leading-relaxed">
                Subscribe to receive exclusive job alerts, career advice, and industry insights tailored to your skills.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <Input 
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button size="lg" type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <span>No Spam, Unsubscribe Anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}