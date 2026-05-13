'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { JobCardWrapper } from '@/components/jobs/JobCardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/jobs?limit=8&status=ACTIVE');
        setJobs(response.data.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
<Section className="bg-[#FFF5F5] dark:bg-[#111827]">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </Section>
    );
  }

  if (jobs.length === 0) return null;

  const sampleJobs = [
    {
      id: '1',
      title: 'Senior ML Architect',
      company: 'OpenAI',
      location: 'San Francisco (Hybrid)',
      salary: '$240k - $320k',
      equity: 'Equity 0.5%',
      match: '99% Match IQ',
      badgeType: 'primary' as const,
    },
    {
      id: '2',
      title: 'Lead AI Engineer',
      company: 'Anthropic',
      location: 'Remote (Global)',
      salary: '$200k - $280k',
      equity: 'Remote First',
      match: 'HOT ROLE',
      badgeType: 'tertiary' as const,
    },
    {
      id: '3',
      title: 'Principal Product Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      salary: '$180k - $250k',
      equity: 'On-site',
      match: 'EXCLUSIVE',
      badgeType: 'secondary' as const,
    },
  ];

  return (
    <Section className="bg-[#FFF5F5] dark:bg-[#111827]">
      <div className="flex justify-between items-end mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Elite Openings</span>
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mt-2">Active Strategic Roles</h2>
          </motion.div>

          <Link href="/jobs">
            <Button variant="ghost" className="text-on-surface hover:text-primary flex items-center gap-2 font-bold">
              VIEW ALL POSITIONS <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`glass-card p-8 rounded-xl hover:scale-[1.02] transition-transform duration-300 border border-white/5 group h-full ${
                index === 1 ? 'border-primary/20' : ''
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-white/5 rounded-lg border border-white/10 p-2 shadow-2xl">
                    <div className="w-full h-full bg-surface-container-highest rounded-lg flex items-center justify-center">
                      <span className="text-on-surface text-xs font-bold">{job.company.charAt(0)}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    job.badgeType === 'primary' ? 'bg-primary/20 text-primary' :
                    job.badgeType === 'tertiary' ? 'bg-tertiary/20 text-tertiary' :
                    'bg-secondary/20 text-secondary'
                  }`}>
                    {job.match}
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-on-surface mb-2">{job.title}</h4>
                <p className="text-on-surface-variant text-sm mb-6">{job.location}</p>
                
                <div className="flex gap-2">
                  <span className="bg-surface-container-highest px-3 py-1 rounded text-xs text-on-surface-variant">
                    {job.salary}
                  </span>
                  <span className="bg-surface-container-highest px-3 py-1 rounded text-xs text-on-surface-variant">
                    {job.equity}
                  </span>
                </div>
                
                <button className={`w-full mt-8 py-3 rounded-lg font-bold transition-colors ${
                  index === 1 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:shadow-primary/40' 
                    : 'border border-outline/30 hover:border-primary text-on-surface'
                }`}>
                  Apply with HireIQ
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    );
}