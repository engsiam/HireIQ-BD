'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Section } from '@/components/ui/section';

const testimonials = [
  {
    name: 'Marcus Vance',
    role: 'CTO, Sensit Dynamics',
    text: 'HireIQ BD didn\'t just find us better candidates; they redefined our entire talent strategy. The speed and precision of their AI engine is unlike anything in the enterprise market.',
  },
];

export default function TestimonialsSection() {
  return (
    <Section className="bg-[#FFF5F5] dark:bg-[#111827]">
      <div className="max-w-4xl mx-auto text-center space-y-8 italic">
        <Quote className="text-primary text-6xl opacity-30 mx-auto" size={60} />
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-on-surface leading-tight"
        >
          "{testimonials[0].text}"
        </motion.blockquote>
        <div className="flex items-center justify-center gap-4">
          <img 
            alt={testimonials[0].name} 
            className="w-16 h-16 rounded-full border-2 border-primary" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ThsHtoFQCNC3Z4Lkj9k5CdBa_FdOdYETzIn1Xngn8oxyOXUhmalrhg1HQFAziMsI3CjrertKbmRWCrchewKYNWFg1b1evFGUY-OtfNmJqcMV5giGewuEK8hf0bcQ6qzALpDKob_r0dAHIk8sGIHtjGqn31VHygLTAlYGFM13v3a8LZt2EAYuoLvnCM_GCug9NuZ-Ehrqm-PfF74K2w59eyB1Ry4eUWdBc1VrCv9gF_g0OFaqk9rVG-2KtZW5yawpurkMxIzR329p"
          />
          <div className="text-left">
            <div className="font-bold text-on-surface">{testimonials[0].name}</div>
            <div className="text-outline text-xs font-bold uppercase tracking-widest">{testimonials[0].role}</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
