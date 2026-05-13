'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  salary: string;
  deadline: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/jobs/my-jobs');
      
      if (response.data.success) {
        setJobs(response.data.data || []);
      }
    } catch (error) {
      setJobs([
        { id: '1', title: 'Senior React Developer', location: 'Dhaka', type: 'FULL_TIME', status: 'OPEN', salary: '80,000 - 120,000 BDT', deadline: '2025-06-15', createdAt: '2025-05-01', _count: { applications: 12 } },
        { id: '2', title: 'Product Manager', location: 'Remote', type: 'FULL_TIME', status: 'OPEN', salary: '100,000 - 150,000 BDT', deadline: '2025-06-20', createdAt: '2025-05-05', _count: { applications: 8 } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Open</Badge>;
      case 'CLOSED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      FULL_TIME: 'bg-blue-500/20 text-blue-400',
      PART_TIME: 'bg-purple-500/20 text-purple-400',
      REMOTE: 'bg-cyan-500/20 text-cyan-400',
      INTERNSHIP: 'bg-amber-500/20 text-amber-400',
    };
    return <Badge className={`${colors[type] || 'bg-gray-500/20'} border-0`}>{type.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Jobs</h1>
          <p className="text-white/50 text-sm">Manage your posted jobs</p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button className="bg-[#EB4C4C] hover:bg-[#FF7070]">
            <Plus size={18} className="mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Jobs Table */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-white/5">
                <TableHead className="text-white/60">Job Title</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Location</TableHead>
                <TableHead className="text-white/60">Applications</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Deadline</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white/40 py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white/40 py-8">
                    No jobs posted yet
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{job.title}</TableCell>
                    <TableCell>{getTypeBadge(job.type)}</TableCell>
                    <TableCell className="text-white/70">{job.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {job._count?.applications || 0} applicants
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-white/70">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/employer/applicants?job=${job.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                          <Edit size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}