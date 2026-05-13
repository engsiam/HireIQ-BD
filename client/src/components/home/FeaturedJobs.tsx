'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types';
import { ArrowRight, MapPin, Briefcase, DollarSign } from 'lucide-react';

function JobCardSkeleton() {
  return (
    <div className="h-[300px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="w-14 h-14 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg mt-auto" />
    </div>
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const skills = job.skills?.slice(0, 3) || ['React', 'TypeScript', 'Node.js'];
  const salary = job.salaryMin && job.salaryMax 
    ? `$${job.salaryMin}k - $${job.salaryMax}k` 
    : 'Competitive';
  const jobType = job.jobType || 'Full-time';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-[300px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col hover:shadow-lg hover:border-[#EB4C4C]/30 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#EB4C4C]/10 to-[#FF7070]/10 flex items-center justify-center border border-gray-200 dark:border-gray-700">
          {job.company?.logo ? (
            <img src={job.company.logo} alt={job.company.name} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <span className="text-[#EB4C4C] font-bold text-lg">{job.company?.name?.charAt(0) || 'C'}</span>
          )}
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EB4C4C]/10 text-[#EB4C4C]">
          {jobType}
        </span>
      </div>

      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{job.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">{job.company?.name || 'Company Name'}</p>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <MapPin size={14} />
        <span>{job.district || job.location || 'Location'}</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-semibold mb-4">
        <DollarSign size={14} className="text-green-500" />
        <span>{salary}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <Link href={`/jobs/${job.id}`} className="mt-auto">
        <Button className="w-full h-10 bg-[#EB4C4C] hover:bg-[#d43f3f] text-white font-bold rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-[#EB4C4C]/20">
          Apply Now
        </Button>
      </Link>
    </motion.div>
  );
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get('/jobs?isFeatured=true&limit=8&status=ACTIVE');
        setJobs(response.data.data?.jobs || response.data.data || []);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Section className="bg-white dark:bg-[#0B1120] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Section>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <Section className="bg-white dark:bg-[#0B1120] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-[#EB4C4C] font-bold uppercase tracking-widest text-xs">Featured</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">Featured Jobs</h2>
          </motion.div>

          <Link href="/jobs">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-[#EB4C4C] flex items-center gap-2 font-bold text-sm">
              View All <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.slice(0, 8).map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}