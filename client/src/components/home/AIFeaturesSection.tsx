'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

const aiFeatures = [
  {
    icon: 'robot_2',
    title: 'Agentic Recruiting',
    description: 'Autonomous AI agents that source and engage candidates across global talent networks without manual intervention.',
    color: 'primary',
    hoverColor: 'bg-primary',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    icon: 'bolt',
    title: 'Velocity Screening',
    description: 'Analyze 10,000 resumes in seconds using neural pattern recognition that understands context beyond keywords.',
    color: 'tertiary',
    hoverColor: 'bg-tertiary',
    bgColor: 'bg-tertiary/10',
    iconColor: 'text-tertiary',
  },
  {
    icon: 'verified_user',
    title: 'Bias Mitigation',
    description: 'Engineered fairness layers that strip identifiers and focus purely on merit and performance signals.',
    color: 'secondary',
    hoverColor: 'bg-secondary',
    bgColor: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
];

export default function AIFeaturesSection() {
  return (
    <Section className="bg-white dark:bg-[#0B1120]" padding="default">
      <div className="mb-12">
        <span className="text-primary font-bold uppercase tracking-widest text-xs">INTELLIGENCE SUITE</span>
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface mt-2">Proprietary IQ Matching Engine</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {aiFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-10 rounded-xl border border-white/5 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
              <span className="material-symbols-outlined text-[80px]">auto_awesome</span>
            </div>
            
            <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
              <span className={`material-symbols-outlined ${feature.iconColor}`}>{feature.icon}</span>
            </div>
            
            <h3 className="text-xl font-bold text-on-surface mb-4">{feature.title}</h3>
            <p className="text-on-surface-variant">{feature.description}</p>
            
            <div className={`mt-8 h-1 w-0 ${feature.hoverColor} group-hover:w-full transition-all duration-500`}></div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}