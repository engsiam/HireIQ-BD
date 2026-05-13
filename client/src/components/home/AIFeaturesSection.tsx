'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  ShieldCheck,
  Sparkles,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { Section } from '@/components/ui/section';


const aiFeatures = [
  {
    icon: Bot,
    title: 'Agentic Recruiting',
    description:
      'Our AI autonomously identifies, screens, and engages top candidates without manual intervention',
    features: [
      'Automated candidate sourcing across 50+ platforms',
      'Intelligent outreach with personalized messaging',
      '24/7 candidate engagement and follow-ups',
    ],
    hoverGlow: 'group-hover:shadow-[#EB4C4C]/30',
    borderGlow: 'group-hover:border-[#EB4C4C]/40',
    bgColor: 'bg-[#EB4C4C]/10',
    iconColor: 'text-[#EB4C4C]',
  },

  {
    icon: Zap,
    title: 'Velocity Screening',
    description:
      'Screen 500+ applicants in minutes using AI-powered skill matching and culture-fit analysis',
    features: [
      'Instant resume parsing and categorization',
      'Skills-based matching with 95% accuracy',
      'Cultural fit assessment using behavioral AI',
    ],
    hoverGlow: 'group-hover:shadow-violet-500/20',
    borderGlow: 'group-hover:border-violet-500/40',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
  },

  {
    icon: ShieldCheck,
    title: 'Bias Mitigation',
    description:
      'Eliminate unconscious bias from your hiring pipeline with our fairness-first AI evaluation system',
    features: [
      'Anonymous candidate evaluation by default',
      'Standardized scoring across all applicants',
      'Diversity-aware hiring recommendations',
    ],
    hoverGlow: 'group-hover:shadow-emerald-500/20',
    borderGlow: 'group-hover:border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
];

export default function AIFeaturesSection() {
  return (
    <Section className="bg-white dark:bg-[#0B1120] relative overflow-hidden" padding="default">
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EB4C4C]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mb-16 text-center max-w-3xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#EB4C4C] font-bold uppercase tracking-[0.3em] text-[10px] bg-[#EB4C4C]/10 px-3 py-1 rounded-full"
        >
          Intelligence Suite
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-6 tracking-tight"
        >
          Proprietary IQ Matching Engine
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              viewport={{ once: true }}
              className="group relative h-full"
            >
              {/* Ambient Glow */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gray-200/70 bg-white/90 p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 dark:border-white/10 dark:bg-white/[0.03] ${feature.borderGlow} ${feature.hoverGlow} hover:-translate-y-2 hover:shadow-2xl`}
              >
                {/* Background Decoration */}
                <div className="absolute -right-8 -top-8 opacity-[0.04] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.08]">
                  <Sparkles className="h-40 w-40 text-white dark:text-white" />
                </div>

                {/* Icon */}
                <div
                  className={`relative mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 ${feature.bgColor} shadow-inner backdrop-blur-md`}
                >
                  <Icon
                    className={`h-8 w-8 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}
                  />
                </div>

                {/* Content */}
                <h3 className="mb-4 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mb-8 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>

                {/* Features */}
                <div className="mt-auto space-y-4">
                  {feature.features.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${feature.bgColor}`}
                      >
                        <Check
                          size={12}
                          className={feature.iconColor}
                        />
                      </div>

                      <span className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    AI Powered
                  </span>

                  <ArrowUpRight
                    className={`h-5 w-5 ${feature.iconColor} transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}