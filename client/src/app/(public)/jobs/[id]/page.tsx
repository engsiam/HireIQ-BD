'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Job, Job as JobType } from '@/types';
import { MapPin, Clock, Briefcase, Building2, Globe, DollarSign, Calendar, Users, ArrowLeft, Heart, Share2 } from 'lucide-react';
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
      <div className="min-h-screen pt-24 pb-12 bg-background">
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
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Jobs</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                      {job.company?.logo ? (
                        <Image src={job.company.logo} alt={job.company.name} width={60} height={60} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-foreground">{job.title}</h1>
                      <p className="text-muted-foreground font-medium flex items-center gap-1 mt-1">
                        <Building2 size={16} />
                        {job.company?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <WishlistButton jobId={job.id} />
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 size={18} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Briefcase size={12} className="mr-1" />
                    {jobTypeLabels[job.jobType] || job.jobType}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin size={12} className="mr-1" />
                    {job.district}
                  </Badge>
                  {job.category && (
                    <Badge variant="outline">{job.category.name}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <DollarSign className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground font-bold uppercase">Salary</p>
                    <p className="font-bold text-foreground">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <Clock className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground font-bold uppercase">Posted</p>
                    <p className="font-bold text-foreground">{formatDate(job.createdAt)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <Calendar className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground font-bold uppercase">Deadline</p>
                    <p className="font-bold text-foreground">{formatDate(job.deadline)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <Users className="w-5 h-5 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground font-bold uppercase">Applications</p>
                    <p className="font-bold text-foreground">{job._count?.applications || 0}</p>
                  </div>
                </div>

                <Button onClick={() => setShowApplyModal(true)} className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full bg-muted/30 p-1 rounded-xl">
                <TabsTrigger value="overview" className="flex-1 rounded-lg font-bold">Overview</TabsTrigger>
                <TabsTrigger value="requirements" className="flex-1 rounded-lg font-bold">Requirements</TabsTrigger>
                <TabsTrigger value="responsibilities" className="flex-1 rounded-lg font-bold">Responsibilities</TabsTrigger>
                <TabsTrigger value="company" className="flex-1 rounded-lg font-bold">Company</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-4">Job Description</h3>
                    <div className="prose-content text-muted-foreground whitespace-pre-line">
                      {job.description}
                    </div>
                    {job.skills && job.skills.length > 0 && (
                      <>
                        <h3 className="text-xl font-bold mt-8 mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <Card className="border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      {job.requirements?.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="responsibilities" className="mt-6">
                <Card className="border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-4">Responsibilities</h3>
                    <ul className="space-y-3">
                      {job.responsibilities?.map((resp, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-muted-foreground">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="mt-6">
                <Card className="border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                        {job.company?.logo ? (
                          <Image src={job.company.logo} alt={job.company.name} width={50} height={50} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{job.company?.name}</h3>
                        {job.company?.industry && <p className="text-muted-foreground">{job.company.industry}</p>}
                      </div>
                    </div>
                    {job.company?.description && (
                      <div>
                        <h4 className="font-bold mb-2">About Company</h4>
                        <p className="text-muted-foreground">{job.company.description}</p>
                      </div>
                    )}
                    {job.company?.website && (
                      <div className="mt-4 flex items-center gap-2">
                        <Globe size={16} className="text-primary" />
                        <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {job.company.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Job Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job Type</span>
                    <span className="font-bold">{jobTypeLabels[job.jobType] || job.jobType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-bold">{job.district}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary Range</span>
                    <span className="font-bold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-bold">{formatDate(job.deadline)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications</span>
                    <span className="font-bold">{job._count?.applications || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Left</span>
                    <span className="font-bold text-primary">{daysUntilDeadline()} days</span>
                  </div>
                </div>
                <Button onClick={() => setShowApplyModal(true)} className="w-full h-12 mt-6 bg-primary hover:bg-primary/90 font-bold rounded-xl">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {similarJobs.length > 0 && (
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Similar Jobs</h3>
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <Link key={similarJob.id} href={`/jobs/${similarJob.id}`}>
                        <div className="p-3 rounded-xl hover:bg-muted/30 transition-colors">
                          <h4 className="font-bold text-sm line-clamp-1">{similarJob.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{similarJob.company?.name}</p>
                          <p className="text-xs text-primary mt-1">{formatSalary(similarJob.salaryMin, similarJob.salaryMax)}</p>
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