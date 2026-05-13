'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Hamza Karim',
    role: 'CTO, Vertex Dynamics',
    text: "HireIQ BD didn't just find us better candidates — they redefined our entire hiring strategy.",
    avatar: 'HK',
  },
  {
    name: 'Fatima Rahman',
    role: 'Software Engineer',
    text: "Found my dream job at bKash in just 2 weeks using the AI matcher. Absolutely incredible tool!",
    avatar: 'FR',
  },
  {
    name: 'Karim Hassan',
    role: 'Data Analyst, Pathao',
    text: "The AI CV analyzer improved my interview callback rate by 300%. Worth every minute.",
    avatar: 'KH',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Section className="bg-[#FFF5F5] dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[#EB4C4C] font-bold uppercase tracking-widest text-xs">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">What People Say</h2>
        </div>

        {/* Desktop: 3 columns grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <Quote className="text-[#EB4C4C] text-4xl opacity-30 mb-4" size={40} />
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Single column with prev/next */}
        <div className="md:hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <Quote className="text-[#EB4C4C] text-4xl opacity-30 mb-4" size={40} />
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-6 leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EB4C4C] to-[#FF7070] flex items-center justify-center text-white font-bold">
                {testimonials[currentIndex].avatar}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{testimonials[currentIndex].name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{testimonials[currentIndex].role}</div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full border-gray-300 dark:border-gray-600">
              <ChevronLeft size={20} />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-[#EB4C4C]' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full border-gray-300 dark:border-gray-600">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}