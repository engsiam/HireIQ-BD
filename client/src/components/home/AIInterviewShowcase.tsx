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
    <Section className="bg-background relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] bg-primary/10 px-3 py-1 rounded-full">Next-Gen Screening</span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
            Conduct 10,000 interviews <span className="text-primary italic">simultaneously.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our conversational AI avatars represent your brand with perfect consistency, conducting deep technical deep-dives and behavioral assessments that scale infinitely.
          </p>
          <ul className="space-y-5">
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 text-foreground font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="text-primary w-4 h-4" />
                </div>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-violet-600/20 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 rounded-[3rem] -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl aspect-video relative"
          >
            <div className="w-full h-full bg-muted/20 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 animate-pulse">
                  <Play className="text-primary ml-1" size={40} fill="currentColor" />
                </div>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.3em]">AI Interview Protocol</p>
              </div>
            </div>

            <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active Analysis</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center glass-panel px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-xl font-black">neurology</span>
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Confidence Score</div>
                  <div className="text-lg font-black text-white leading-none">92.4%</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Latency</div>
                <div className="text-lg font-black text-green-400 leading-none">14ms</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}