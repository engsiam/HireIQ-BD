'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { CheckCircle, Play } from 'lucide-react';

export default function AIInterviewShowcase() {
  const features = [
    'Natural language understanding in 40+ languages',
    'Real-time sentiment and competence analysis',
    'Instant synthesis reports for hiring managers',
  ];

  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">Next-Gen Screening</span>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface">Conduct 10,000 interviews simultaneously.</h2>
          <p className="text-lg text-on-surface-variant">
            Our conversational AI avatars represent your brand with perfect consistency, conducting deep technical deep-dives and behavioral assessments that scale infinitely.
          </p>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-on-surface">
                <CheckCircle className="text-primary" size={24} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video relative"
          >
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Play className="text-primary" size={40} fill="currentColor" />
                </div>
                <p className="text-on-surface text-sm font-bold uppercase tracking-widest">AI Interview Demo</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Play className="text-on-primary text-4xl" size={40} fill="currentColor" />
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center glass-card p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-on-surface uppercase tracking-widest">Live AI Analysis</span>
              </div>
              <div className="text-primary font-bold">92% Engagement</div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}