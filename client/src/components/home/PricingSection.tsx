'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

export default function PricingSection() {
  const plans = [
    {
      name: 'Professional',
      price: '$2,499',
      period: '/mo',
      features: [
        '5 Active AI Pipelines',
        'Standard Match Engine',
        'Basic Analytics Dashboard',
      ],
      notIncluded: ['AI Interview Avatars'],
      cta: 'Choose Plan',
      popular: false,
    },
    {
      name: 'Enterprise',
      price: '$5,999',
      period: '/mo',
      features: [
        'Unlimited AI Pipelines',
        'Agentic Source Pro',
        'Custom AI Interview Persona',
        'Full API Access',
      ],
      notIncluded: [],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Quantum AI',
      price: 'Custom',
      period: '',
      features: [
        'White-Glove Onboarding',
        'On-Premise LLM Hosting',
        'Dedicated Talent Engineer',
        '24/7 Priority Concierge',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <Section>
      <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">Investment</span>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mt-2">Scale Your Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-8 md:p-10 rounded-2xl border border-white/5 ${
                plan.popular ? 'p-10 md:p-12 border-2 border-primary relative scale-105 z-10 shadow-[0_0_40px_rgba(235,76,76,0.1)]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase px-6 py-2 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-on-surface text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl md:text-4xl font-bold text-on-surface mb-6">
                {plan.price}
                {plan.period && <span className="text-base font-normal text-outline">{plan.period}</span>}
              </div>
              
              <ul className="space-y-4 mb-10 text-on-surface-variant">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={16} className="text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 opacity-30">
                    <X size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-4 rounded-lg font-bold ${
                  plan.popular 
                    ? 'bg-primary text-on-primary shadow-xl shadow-primary/20' 
                    : 'border border-outline/30 text-on-surface hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </Section>
    );
}