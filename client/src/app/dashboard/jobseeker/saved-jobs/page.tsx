'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSavedJobsStore } from '@/store/useSavedJobsStore';
import { useIsAuthenticated } from '@/store/useAuthStore';
import axiosInstance from '@/lib/axiosInstance';
import { Heart, MapPin, Clock, Briefcase, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
}

export default function SavedJobsPage() {
  const { savedJobs, removeSavedJob } = useSavedJobsStore();
  const isAuthenticated = useIsAuthenticated();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (savedJobs.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axiosInstance.get('/jobs');
        if (response.data.success) {
          const allJobs = response.data.data || [];
          const filtered = allJobs.filter((job: Job) => savedJobs.includes(job.id));
          setJobs(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedJobs();
  }, [savedJobs]);

  const handleRemove = (jobId: string) => {
    removeSavedJob(jobId);
    setJobs(jobs.filter(j => j.id !== jobId));
    toast.success('Job removed from saved');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Please login to view saved jobs</p>
          <Link href="/login">
            <Button className="bg-[#EB4C4C] hover:bg-[#FF7070]">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
        <p className="text-white/50 text-sm">Jobs you have saved for later ({savedJobs.length})</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardContent className="p-12 text-center">
            <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No saved jobs yet</h3>
            <p className="text-white/50 mb-4">Start browsing jobs and save the ones you like</p>
            <Link href="/jobs">
              <Button className="bg-[#EB4C4C] hover:bg-[#FF7070]">Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white hover:text-[#EB4C4C] transition-colors">
                          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-white/60 text-sm">{job.companyName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(job.id)}
                        className="text-white/40 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-white/50">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {job.type?.replace('_', ' ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : 'Ongoing'}
                      </div>
                    </div>
                    
                    {job.salary && (
                      <p className="text-[#EB4C4C] font-medium mt-2">{job.salary}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}