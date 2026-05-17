'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Building2, Calendar } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import Link from 'next/link';

interface Application {
  id: string;
  status: string;
  coverLetter: string;
  resumeUrl: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    companyName: string;
    location: string;
    type: string;
    salary: string;
  };
}

export default function JobseekerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await axiosInstance.get(`/applications/my-applications${params}`);
      
      if (response.data.success) {
        setApplications(response.data.data || []);
      }
    } catch (error) {
      setApplications([
        { id: '1', status: 'SHORTLISTED', coverLetter: 'I am excited about this opportunity...', resumeUrl: '#', createdAt: '2025-05-10', job: { id: '1', title: 'Senior React Developer', companyName: 'Tech Corp', location: 'Dhaka', type: 'FULL_TIME', salary: '80,000 - 120,000 BDT' } },
        { id: '2', status: 'PENDING', coverLetter: 'I would love to join your team...', resumeUrl: '#', createdAt: '2025-05-08', job: { id: '2', title: 'Product Manager', companyName: 'Startup Inc', location: 'Remote', type: 'FULL_TIME', salary: '100,000 - 150,000 BDT' } },
        { id: '3', status: 'REJECTED', coverLetter: 'Thank you for considering...', resumeUrl: '#', createdAt: '2025-05-01', job: { id: '3', title: 'UX Designer', companyName: 'Design Co', location: 'Chittagong', type: 'FULL_TIME', salary: '50,000 - 80,000 BDT' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
      SHORTLISTED: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
      HIRED: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
      INTERVIEW: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
    hired: applications.filter(a => a.status === 'HIRED').length,
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground text-sm">Track your job applications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-green-600 dark:text-green-400' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600 dark:text-red-400' },
          { label: 'Hired', value: stats.hired, color: 'text-purple-600 dark:text-purple-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border rounded-xl">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card className="bg-card border-border rounded-xl">
        <CardContent className="p-4">
          <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-48 bg-background border-border text-foreground">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-foreground">All Status</SelectItem>
              <SelectItem value="PENDING" className="text-foreground">Pending</SelectItem>
              <SelectItem value="SHORTLISTED" className="text-foreground">Shortlisted</SelectItem>
              <SelectItem value="INTERVIEW" className="text-foreground">Interview</SelectItem>
              <SelectItem value="HIRED" className="text-foreground">Hired</SelectItem>
              <SelectItem value="REJECTED" className="text-foreground">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="bg-card border-border rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Job</TableHead>
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Applied Date</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{app.job?.title}</p>
                        <p className="text-xs text-muted-foreground">{app.job?.salary}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-muted-foreground/50" />
                        {app.job?.companyName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                        {app.job?.type?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/jobs/${app.job?.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Eye size={16} />
                        </Button>
                      </Link>
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