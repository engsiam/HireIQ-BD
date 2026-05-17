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
        return <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">Open</Badge>;
      case 'CLOSED':
        return <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      FULL_TIME: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      PART_TIME: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      REMOTE: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
      INTERNSHIP: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
    };
    return <Badge className={`${colors[type] || 'bg-gray-500/20'} border-0`}>{type.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
          <p className="text-muted-foreground text-sm">Manage your posted jobs</p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={18} className="mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Jobs Table */}
      <Card className="bg-card border-border rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Job Title</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Applications</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Deadline</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No jobs posted yet
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{job.title}</TableCell>
                    <TableCell>{getTypeBadge(job.type)}</TableCell>
                    <TableCell className="text-muted-foreground">{job.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {job._count?.applications || 0} applicants
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/dashboard/employer/applicants?job=${job.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
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