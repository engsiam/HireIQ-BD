'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { UserPlus, Brain, Award } from 'lucide-react';

const steps = [
  { 
    step: '01', 
    title: 'Create Profile', 
    desc: 'Sign up and create your professional profile. Upload your CV and let our AI analyze your strengths.',
    icon: UserPlus
  },
  { 
    step: '02', 
    title: 'AI Matches You', 
    desc: 'Our AI algorithm matches you with jobs that align with your skills, experience, and career goals.',
    icon: Brain
  },
  { 
    step: '03', 
    title: 'Get Hired', 
    desc: 'Apply with one click, track your applications, and land your dream job in Bangladesh.',
    icon: Award
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 bg-[#FFF5F5] dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-3 justify-center">
              <div className="w-10 h-0.5 bg-primary" />
              <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">
                Your Journey
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              How It <span className="text-primary italic">Works</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <div className="p-8 bg-card border border-border rounded-2xl h-full hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-6xl font-black text-primary/10 absolute bottom-4 right-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}