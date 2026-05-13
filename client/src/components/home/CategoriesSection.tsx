'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code, Briefcase, Heart, GraduationCap, Cpu, Factory, Building2, PenTool } from 'lucide-react';

const jobCategories = [
  { name: 'Technology', icon: Code, count: '500+' },
  { name: 'Finance', icon: Briefcase, count: '350+' },
  { name: 'Healthcare', icon: Heart, count: '280+' },
  { name: 'Marketing', icon: PenTool, count: '420+' },
  { name: 'Education', icon: GraduationCap, count: '180+' },
  { name: 'Engineering', icon: Cpu, count: '650+' },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-16 md:py-24 px-4 bg-white dark:bg-[#0B1120]">
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
                Career Paths
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Browse by <span className="text-primary italic">Category</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {jobCategories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/jobs?category=${encodeURIComponent(cat.name.toLowerCase())}`}>
                <div className="p-6 bg-card border border-border rounded-2xl text-center hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-primary transition-colors">
                    <cat.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{cat.count} Jobs</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}