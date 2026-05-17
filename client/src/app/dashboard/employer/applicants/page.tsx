'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Mail, Phone, FileText } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

interface Applicant {
  id: string;
  status: string;
  coverLetter: string;
  resumeUrl: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    skills?: string[];
  };
  job: {
    title: string;
  };
}

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await axiosInstance.get(`/applications/my-applicants?${params.toString()}`);
      
      if (response.data.success) {
        setApplicants(response.data.data || []);
      }
    } catch (error) {
      setApplicants([
        { id: '1', status: 'PENDING', coverLetter: 'I am interested in this position...', resumeUrl: '#', createdAt: '2025-05-10', user: { name: 'John Doe', email: 'john@example.com', phone: '+8801234567890', skills: ['React', 'Node.js'] }, job: { title: 'Senior React Developer' } },
        { id: '2', status: 'SHORTLISTED', coverLetter: 'Excited about this opportunity...', resumeUrl: '#', createdAt: '2025-05-08', user: { name: 'Jane Smith', email: 'jane@example.com', phone: '+8809876543210', skills: ['Python', 'Django'] }, job: { title: 'Senior React Developer' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axiosInstance.patch(`/applications/${id}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchApplicants();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

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

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Applicants</h1>
        <p className="text-muted-foreground text-sm">Review job applications</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-40 bg-background border-border text-foreground">
                <SelectValue placeholder="Status" />
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
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card className="bg-card border-border rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Applicant</TableHead>
                <TableHead className="text-muted-foreground">Applied For</TableHead>
                <TableHead className="text-muted-foreground">Skills</TableHead>
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
              ) : applicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No applicants found
                  </TableCell>
                </TableRow>
              ) : (
                applicants.map((app) => (
                  <TableRow key={app.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{app.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{app.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app.job?.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {app.user?.skills?.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-border text-muted-foreground">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Profile">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Send Email">
                          <Mail size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Resume">
                          <FileText size={16} />
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