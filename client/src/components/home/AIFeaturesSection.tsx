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
    <Section className="bg-background relative overflow-hidden" padding="default">
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mb-16 text-center max-w-3xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] bg-primary/10 px-3 py-1 rounded-full"
        >
          Intelligence Suite
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-foreground mt-6 tracking-tight"
        >
          Proprietary IQ Matching Engine
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {aiFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="group relative"
          >
            {/* Hover Glow */}
            <div className={`absolute inset-0 ${feature.hoverColor}/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10`} />
            
            <div className="h-full glass-card p-10 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col items-start shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                <span className="material-symbols-outlined text-[100px] select-none">auto_awesome</span>
              </div>
              
              <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/5`}>
                <span className={`material-symbols-outlined text-3xl ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              
              <div className={`mt-auto pt-8 w-full`}>
                <div className={`h-1 w-0 ${feature.hoverColor} group-hover:w-full transition-all duration-700 rounded-full`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}