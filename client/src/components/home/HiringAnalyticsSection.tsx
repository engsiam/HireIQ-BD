'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';

export default function HiringAnalyticsSection() {
  const chartData = [
    { height: 'h-1/4', label: '12' },
    { height: 'h-2/4', label: '28' },
    { height: 'h-3/4', label: '42' },
    { height: 'h-1/2', label: '35' },
    { height: 'h-3/5', label: '48' },
    { height: 'h-[90%]', label: '76' },
    { height: 'h-full', label: '95' },
  ];

  return (
    <Section className="relative">
      <div className="absolute inset-0 cinematic-glow opacity-30 -z-10"></div>
      <div className="relative z-10">
        <div className="text-center mb-12">
          <span className="text-tertiary font-bold uppercase tracking-widest text-xs">Command Center</span>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mt-2">Fintech-Grade Performance Analytics</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 border border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 bg-surface-container/30 rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h4 className="text-xl font-bold text-on-surface">Hiring Velocity</h4>
                <p className="text-sm text-on-surface-variant">Real-time throughput analytics</p>
              </div>
              <span className="text-tertiary text-2xl font-bold">+24% <span className="text-sm font-normal">MoM</span></span>
            </div>
            <div className="h-64 flex items-end gap-2 px-2">
              {chartData.map((item, index) => (
                <div key={index} className={`flex-1 ${item.height} bg-primary/20 rounded-t-lg relative group`}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label} Candidates
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-high/50 p-6 rounded-2xl border border-white/5">
              <div className="text-sm text-outline font-bold uppercase mb-2">Quality of Hire</div>
              <div className="text-4xl font-bold text-on-surface tracking-tighter">8.9<span className="text-base font-normal text-outline">/10</span></div>
              <div className="mt-4 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-[89%]"></div>
              </div>
            </div>
            <div className="bg-surface-container-high/50 p-6 rounded-2xl border border-white/5">
              <div className="text-sm text-outline font-bold uppercase mb-2">Cost Per Hire Reduction</div>
              <div className="text-4xl font-bold text-on-surface tracking-tighter">64%</div>
              <div className="mt-4 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[64%]"></div>
              </div>
            </div>
            <div className="bg-surface-container-high/50 p-6 rounded-2xl border border-white/5">
              <div className="text-sm text-outline font-bold uppercase mb-2">Diversity Score</div>
              <div className="text-4xl font-bold text-on-surface tracking-tighter">AAA</div>
              <p className="text-sm text-on-surface-variant mt-2">Maximum fairness index achieved</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}