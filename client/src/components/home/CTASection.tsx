'use client';

import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { ArrowRight, Sparkles, Briefcase, Users, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <Section as="div" className="bg-[#EB4C4C] text-white relative overflow-hidden" padding="none">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-8"
          >
            <Sparkles size={16} className="text-white animate-pulse" />
            <span className="text-white text-xs font-black uppercase tracking-[0.4em]">Start Today</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6"
          >
            Ready to Land Your <span className="text-[#FFEDC7]">Dream Job</span>?
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Join thousands of job seekers who found their perfect career match with HireIQ BD's AI-powered platform.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button className="h-14 px-8 rounded-full font-black text-sm uppercase tracking-wider inline-flex items-center gap-3 bg-white text-[#EB4C4C] hover:bg-[#FFF5F5] transition-all border border-white">
                <span>Create Free Account</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button 
                className="h-14 px-8 rounded-full font-black text-sm uppercase tracking-wider bg-white text-[#EB4C4C] hover:bg-[#FFF5F5] border border-white"
              >
                Browse Jobs
              </Button>
            </Link>
            <Link href="/register?role=EMPLOYER">
              <Button 
                className="h-14 px-8 rounded-full font-black text-sm uppercase tracking-wider bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Post a Job
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">5000+</p>
                <p className="text-sm text-white/60">Active Jobs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">1200+</p>
                <p className="text-sm text-white/60">Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">50k+</p>
                <p className="text-sm text-white/60">Job Seekers</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}