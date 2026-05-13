'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Job, Job as JobType } from '@/types';
import { MapPin, Clock, Briefcase, Building2, DollarSign, Calendar, Users, ArrowLeft, Heart, Share2, Mail, Globe } from 'lucide-react';
import WishlistButton from '@/components/jobs/WishlistButton';
import ApplyModal from '@/components/jobs/ApplyModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<JobType[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        setJob(response.data.data);
        
        const similarResponse = await axiosInstance.get(`/jobs?category=${response.data.data?.category?.name || ''}&limit=4`);
        setSimilarJobs(similarResponse.data.data?.filter((j: JobType) => j.id !== id) || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    notFound();
  }

  const jobTypeLabels: Record<string, string> = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    REMOTE: 'Remote',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Negotiable';
    const format = (num: number) => `৳${(num / 1000).toFixed(0)}k`;
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const daysUntilDeadline = () => {
    const deadline = new Date(job.deadline);
    const now = new Date();
    const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#EB4C4C] mb-6 font-medium">
          <ArrowLeft size={18} />
          <span>Back to Jobs</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                      {job.company?.logo ? (
                        <Image src={job.company.logo} alt={job.company.name} width={60} height={60} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-white">{job.title}</h1>
                      <p className="text-white/80 font-medium flex items-center gap-1 mt-1">
                        <Building2 size={16} />
                        {job.company?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <WishlistButton jobId={job.id} />
                    <Button variant="outline" size="icon" className="rounded-full bg-white/20 border-0 text-white hover:bg-white/30">
                      <Share2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-white/10 text-white border-0">
                    <Briefcase size={12} className="mr-1" />
                    {jobTypeLabels[job.jobType] || job.jobType}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    <MapPin size={12} className="mr-1" />
                    {job.district}
                  </Badge>
                  {job.category && (
                    <Badge variant="outline" className="border-white/30 text-white">{job.category.name}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-[#1E293B] rounded-xl p-4">
                    <DollarSign className="w-5 h-5 text-[#EB4C4C] mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Salary</p>
                    <p className="font-bold text-gray-900 dark:text-white">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#1E293B] rounded-xl p-4">
                    <Clock className="w-5 h-5 text-[#EB4C4C] mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Job Type</p>
                    <p className="font-bold text-gray-900 dark:text-white">{jobTypeLabels[job.jobType] || job.jobType}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#1E293B] rounded-xl p-4">
                    <Users className="w-5 h-5 text-[#EB4C4C] mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Vacancies</p>
                    <p className="font-bold text-gray-900 dark:text-white">{((job as unknown) as { vacancies?: number }).vacancies || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#1E293B] rounded-xl p-4">
                    <Calendar className="w-5 h-5 text-[#EB4C4C] mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Deadline</p>
                    <p className="font-bold text-gray-900 dark:text-white">{daysUntilDeadline()} days left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description Card */}
            <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Job Description</h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p className="whitespace-pre-line">{job.description || 'No description provided.'}</p>
                </div>

                {job.requirements && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {Array.isArray(job.requirements) ? (
                        job.requirements.map((req: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EB4C4C] mt-2 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))
                      ) : (
                        <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">{job.requirements}</p>
                      )}
                    </ul>
                  </>
                )}

                {job.responsibilities && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Responsibilities</h3>
                    <ul className="space-y-2">
                      {Array.isArray(job.responsibilities) ? (
                        job.responsibilities.map((resp: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EB4C4C] mt-2 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))
                      ) : (
                        <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">{job.responsibilities}</p>
                      )}
                    </ul>
                  </>
                )}

                {job.skills && job.skills.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string, index: number) => (
                        <Badge key={index} className="bg-[#EB4C4C]/10 text-[#EB4C4C] border-0 px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Company Info Card */}
            <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">About Company</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-[#1E293B] flex items-center justify-center overflow-hidden shrink-0">
                    {job.company?.logo ? (
                      <Image src={job.company.logo} alt={job.company.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{job.company?.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{job.company?.description || 'No description available'}</p>
                    {job.company?.website && (
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-[#EB4C4C] text-sm flex items-center gap-1 mt-2 hover:underline">
                        <Globe size={14} />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-2xl sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-black text-[#EB4C4C]">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">per month</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="text-[#EB4C4C]" />
                    <span className="text-sm">{job.district}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Briefcase size={16} className="text-[#EB4C4C]" />
                    <span className="text-sm">{jobTypeLabels[job.jobType] || job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="text-[#EB4C4C]" />
                    <span className="text-sm">Posted {formatDate(job.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Calendar size={16} className="text-[#EB4C4C]" />
                    <span className="text-sm">Deadline {formatDate(job.deadline)}</span>
                  </div>
                </div>

                <Button onClick={() => setShowApplyModal(true)} className="w-full h-14 bg-[#EB4C4C] hover:bg-[#FF7070] text-white font-bold rounded-xl text-lg">
                  Apply Now
                </Button>
                
                <p className="text-center text-gray-400 text-xs mt-4">
                  {((job as unknown) as { vacancies?: number }).vacancies || 1} position available
                </p>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <Card className="border-0 shadow-xl shadow-black/5 dark:shadow-black/20 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Similar Jobs</h3>
                  <div className="space-y-4">
                    {similarJobs.slice(0, 3).map((similarJob) => (
                      <Link key={similarJob.id} href={`/jobs/${similarJob.id}`} className="block group">
                        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-[#EB4C4C]/10 flex items-center justify-center shrink-0">
                            <Building2 size={16} className="text-[#EB4C4C]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#EB4C4C] transition-colors line-clamp-1">
                              {similarJob.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {similarJob.company?.name}
                            </p>
                            <p className="text-xs text-[#EB4C4C] font-medium mt-0.5">
                              {formatSalary(similarJob.salaryMin, similarJob.salaryMax)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ApplyModal job={job} open={showApplyModal} onOpenChange={setShowApplyModal} />
    </div>
  );
}