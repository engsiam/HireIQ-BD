'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';

export default function HiringAnalyticsSection() {
  const chartData = [
    { height: 'h-1/4', label: '12' },
    { height: 'h-2/4', label: '28' },
    { height: 'h-3/4', label: '42' },
    { height: 'h-1/2', label: '35' },
    { height: 'h-3/5', label: '48' },
    { height: 'h-[90%]', label: '76' },
    { height: 'h-full', label: '95' },
  ];

  return (
    <Section className="relative bg-background overflow-hidden">
      {/* Dynamic Glow Background */}
      <div className="absolute inset-0 cinematic-glow opacity-40 -z-10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] bg-primary/10 px-4 py-1.5 rounded-full"
          >
            Command Center
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-foreground mt-6 tracking-tight"
          >
            Fintech-Grade Performance Analytics
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-[2.5rem] p-10 border border-border/50 grid grid-cols-1 lg:grid-cols-3 gap-12 shadow-2xl"
        >
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-muted/30 rounded-[2rem] p-8 border border-border/40 relative group overflow-hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h4 className="text-2xl font-bold text-foreground">Hiring Velocity</h4>
                <p className="text-sm text-muted-foreground mt-1">Real-time throughput analytics</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-primary text-3xl font-black">+24%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Month over Month</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end gap-3 px-2">
              {chartData.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ height: 0 }}
                  whileInView={{ height: item.height.includes('%') ? item.height : (item.height === 'h-full' ? '100%' : (item.height.split('-')[1] === '1/4' ? '25%' : (item.height.split('-')[1] === '2/4' ? '50%' : (item.height.split('-')[1] === '3/4' ? '75%' : (item.height.split('-')[1] === '1/2' ? '50%' : (item.height.split('-')[1] === '3/5' ? '60%' : '100%')))))) }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className={`flex-1 bg-gradient-to-t from-primary/10 to-primary/60 rounded-t-xl relative group cursor-pointer hover:to-primary/80 transition-all`}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap">
                    {item.label} Candidates
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Grid Line Decoration */}
            <div className="absolute inset-0 grid-texture opacity-[0.03] pointer-events-none" />
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-muted/40 p-8 rounded-[2rem] border border-border/40 hover:border-primary/20 transition-colors group">
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-3 group-hover:text-primary transition-colors">Quality of Hire</div>
              <div className="text-5xl font-black text-foreground tracking-tighter">8.9<span className="text-lg font-bold text-muted-foreground">/10</span></div>
              <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '89%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>

            <div className="bg-muted/40 p-8 rounded-[2rem] border border-border/40 hover:border-primary/20 transition-colors group">
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-3 group-hover:text-primary transition-colors">Cost Reduction</div>
              <div className="text-5xl font-black text-foreground tracking-tighter">64%</div>
              <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: '64%' }}
                   transition={{ duration: 1.5, delay: 0.7 }}
                   className="h-full bg-primary" 
                />
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/20 hover:bg-primary/10 transition-all">
              <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3">Diversity Score</div>
              <div className="text-5xl font-black text-foreground tracking-tighter">AAA</div>
              <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">Maximum fairness index achieved via agentic bias mitigation protocols.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}