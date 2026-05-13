'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { Briefcase, Building2, Users, TrendingUp } from 'lucide-react';

const stats = [
  { value: '5000+', label: 'Jobs Posted', icon: Briefcase },
  { value: '1200+', label: 'Companies', icon: Building2 },
  { value: '50000+', label: 'Job Seekers', icon: Users },
  { value: '98%', label: 'Success Rate', icon: TrendingUp },
];

export default function StatsSection() {
  return (
    <Section as="div" className="bg-[#EB4C4C] text-white" padding="none">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl md:text-5xl font-bold tracking-tight mb-2 group-hover:scale-110 transition-transform duration-500">
                {stat.value}
              </div>
              <div className="font-bold uppercase tracking-[0.2em] text-xs text-white/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}