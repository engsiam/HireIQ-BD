'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Briefcase, Building2 } from 'lucide-react';
import { Job } from '@/types';
import { cn } from '@/lib/utils';
import WishlistButton from './WishlistButton';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const jobTypeLabels: Record<string, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    REMOTE: 'Remote',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Negotiable';
    const format = (num: number) => {
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
      return num.toString();
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="group h-full border-border/50 hover:border-[#EB4C4C]/30 hover:shadow-xl hover:shadow-[#EB4C4C]/5 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-[#1E293B]">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EB4C4C]/10 to-[#EB4C4C]/5 flex items-center justify-center overflow-hidden shrink-0 border border-[#EB4C4C]/20">
              {job.company?.logo ? (
                <Image
                  src={job.company.logo}
                  alt={job.company.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-[#EB4C4C]" />
              )}
            </div>
            <WishlistButton jobId={job.id} />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#EB4C4C] transition-colors line-clamp-2">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-1">
                <Building2 size={14} />
                {job.company?.name}
              </p>
            </div>

            {job.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {job.description.length > 120 ? job.description.slice(0, 120) + '...' : job.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#EB4C4C]/10 text-[#EB4C4C] hover:bg-[#EB4C4C]/20 border-0">
                {jobTypeLabels[job.jobType] || job.jobType}
              </Badge>
              <Badge variant="outline" className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700">
                <MapPin size={12} className="mr-1" />
                {job.district}
              </Badge>
            </div>

            <div className="text-xl font-bold text-[#EB4C4C]">
              {formatSalary(job.salaryMin, job.salaryMax)}
              <span className="text-xs text-gray-400 font-normal">/month</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              {formatDate(job.createdAt)}
            </div>
            <Button size="sm" className="bg-[#EB4C4C] hover:bg-[#FF7070] text-white rounded-xl px-4">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}