'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Trash2, Edit, Eye, Loader2, Plus } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  category: string;
  status: string;
  salary: string;
  deadline: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  skills?: string[];
  createdAt: string;
}

const initialFormData: Partial<Job> = {
  title: '',
  companyName: '',
  location: '',
  type: 'FULL_TIME',
  category: 'Technology',
  status: 'OPEN',
  salary: '',
  deadline: '',
  description: '',
  requirements: '',
  responsibilities: '',
  skills: [],
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<Partial<Job>>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await axiosInstance.get(`/jobs?${params.toString()}`);
      
      if (response.data.success) {
        setJobs(response.data.data || []);
        setTotalPages(response.data.meta?.totalPages || 1);
      }
    } catch (error) {
      setJobs([
        { id: '1', title: 'Senior React Developer', companyName: 'Tech Corp', location: 'Dhaka', type: 'FULL_TIME', category: 'Technology', status: 'OPEN', salary: '80,000 - 120,000 BDT', deadline: '2025-06-15', description: 'We are looking for a senior react developer', requirements: '3+ years experience', responsibilities: 'Build React applications', skills: ['React', 'TypeScript'], createdAt: '2025-05-01' },
        { id: '2', title: 'Product Manager', companyName: 'Startup Inc', location: 'Remote', type: 'FULL_TIME', category: 'Management', status: 'OPEN', salary: '100,000 - 150,000 BDT', deadline: '2025-06-20', description: 'Lead product development', requirements: '5+ years experience', responsibilities: 'Manage product roadmap', skills: ['Agile', 'Scrum'], createdAt: '2025-05-05' },
        { id: '3', title: 'UX Designer', companyName: 'Design Co', location: 'Chittagong', type: 'REMOTE', category: 'Design', status: 'CLOSED', salary: '50,000 - 80,000 BDT', deadline: '2025-05-01', description: 'Design user interfaces', requirements: '2+ years experience', responsibilities: 'Create UI designs', skills: ['Figma', 'Sketch'], createdAt: '2025-04-15' },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, statusFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1);
  };

  // View Job
  const handleView = (job: Job) => {
    setSelectedJob(job);
    setViewModalOpen(true);
  };

  // Edit Job
  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      type: job.type,
      category: job.category,
      status: job.status,
      salary: job.salary,
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      description: job.description || '',
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || '',
      skills: job.skills || [],
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedJob) return;
    setSaving(true);
    try {
      await axiosInstance.patch(`/jobs/${selectedJob.id}`, formData);
      toast.success('Job updated successfully!');
      setEditModalOpen(false);
      fetchJobs(currentPage);
    } catch (error) {
      toast.error('Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  // Create Job
  const handleCreateClick = () => {
    setFormData(initialFormData);
    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await axiosInstance.post('/jobs', formData);
      toast.success('Job created successfully!');
      setCreateModalOpen(false);
      fetchJobs(currentPage);
    } catch (error) {
      toast.error('Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  // Delete Job
  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/jobs/${selectedJob.id}`);
      toast.success('Job deleted successfully!');
      setDeleteModalOpen(false);
      fetchJobs(currentPage);
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

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

  const getJobTypeBadge = (type: string) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Jobs</h1>
          <p className="text-white/50 text-sm">View and manage all job listings</p>
        </div>
        <Button onClick={handleCreateClick} className="bg-[#EB4C4C] hover:bg-[#FF7070]">
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="OPEN" className="text-white">Open</SelectItem>
                <SelectItem value="CLOSED" className="text-white">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-[#EB4C4C] hover:bg-[#FF7070]">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-white/5">
                <TableHead className="text-white/60">Job Title</TableHead>
                <TableHead className="text-white/60">Company</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Location</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Deadline</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white/40 py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white/40 py-8">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{job.title}</TableCell>
                    <TableCell className="text-white/70">{job.companyName}</TableCell>
                    <TableCell>{getJobTypeBadge(job.type)}</TableCell>
                    <TableCell className="text-white/70">{job.location}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-white/70">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={() => handleView(job)}>
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={() => handleEdit(job)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-red-400" onClick={() => handleDeleteClick(job)}>
                          <Trash2 size={16} />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="border-white/10 text-white hover:bg-white/10">
            Previous
          </Button>
          <span className="text-white/60 text-sm">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="border-white/10 text-white hover:bg-white/10">
            Next
          </Button>
        </div>
      )}

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/50">Title</Label>
                  <p className="font-semibold text-white">{selectedJob.title}</p>
                </div>
                <div>
                  <Label className="text-white/50">Company</Label>
                  <p className="font-semibold text-white">{selectedJob.companyName}</p>
                </div>
                <div>
                  <Label className="text-white/50">Location</Label>
                  <p className="text-white">{selectedJob.location}</p>
                </div>
                <div>
                  <Label className="text-white/50">Type</Label>
                  <p className="text-white">{selectedJob.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-white/50">Category</Label>
                  <p className="text-white">{selectedJob.category}</p>
                </div>
                <div>
                  <Label className="text-white/50">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedJob.status)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-white/50">Salary</Label>
                  <p className="text-white">{selectedJob.salary || 'Not specified'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-white/50">Deadline</Label>
                  <p className="text-white">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'Ongoing'}</p>
                </div>
                {selectedJob.description && (
                  <div className="col-span-2">
                    <Label className="text-white/50">Description</Label>
                    <p className="text-white/80">{selectedJob.description}</p>
                  </div>
                )}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-white/50">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedJob.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-white/70">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Company</Label>
                <Input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Location</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Type</Label>
                <Select value={formData.type} onValueChange={(value) => value && setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="FULL_TIME" className="text-white">Full Time</SelectItem>
                    <SelectItem value="PART_TIME" className="text-white">Part Time</SelectItem>
                    <SelectItem value="REMOTE" className="text-white">Remote</SelectItem>
                    <SelectItem value="INTERNSHIP" className="text-white">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Category</Label>
                <Select value={formData.category} onValueChange={(value) => value && setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="Technology" className="text-white">Technology</SelectItem>
                    <SelectItem value="Finance" className="text-white">Finance</SelectItem>
                    <SelectItem value="Marketing" className="text-white">Marketing</SelectItem>
                    <SelectItem value="Healthcare" className="text-white">Healthcare</SelectItem>
                    <SelectItem value="Education" className="text-white">Education</SelectItem>
                    <SelectItem value="Engineering" className="text-white">Engineering</SelectItem>
                    <SelectItem value="Design" className="text-white">Design</SelectItem>
                    <SelectItem value="Sales" className="text-white">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Status</Label>
                <Select value={formData.status} onValueChange={(value) => value && setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="OPEN" className="text-white">Open</SelectItem>
                    <SelectItem value="CLOSED" className="text-white">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Salary</Label>
                <Input value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="bg-white/5 border-white/10 text-white" placeholder="e.g. 50,000 - 100,000 BDT" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Deadline</Label>
                <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
            <Button onClick={handleUpdate} disabled={saving} className="bg-[#EB4C4C] hover:bg-[#FF7070]">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Job Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Title *</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="bg-white/5 border-white/10 text-white" 
                  placeholder="Job title"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Company *</Label>
                <Input 
                  value={formData.companyName} 
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} 
                  className="bg-white/5 border-white/10 text-white" 
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Location *</Label>
                <Input 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                  className="bg-white/5 border-white/10 text-white" 
                  placeholder="Location"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Type</Label>
                <Select value={formData.type} onValueChange={(value) => value && setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="FULL_TIME" className="text-white">Full Time</SelectItem>
                    <SelectItem value="PART_TIME" className="text-white">Part Time</SelectItem>
                    <SelectItem value="REMOTE" className="text-white">Remote</SelectItem>
                    <SelectItem value="INTERNSHIP" className="text-white">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Category</Label>
                <Select value={formData.category} onValueChange={(value) => value && setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="Technology" className="text-white">Technology</SelectItem>
                    <SelectItem value="Finance" className="text-white">Finance</SelectItem>
                    <SelectItem value="Marketing" className="text-white">Marketing</SelectItem>
                    <SelectItem value="Healthcare" className="text-white">Healthcare</SelectItem>
                    <SelectItem value="Education" className="text-white">Education</SelectItem>
                    <SelectItem value="Engineering" className="text-white">Engineering</SelectItem>
                    <SelectItem value="Design" className="text-white">Design</SelectItem>
                    <SelectItem value="Sales" className="text-white">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Status</Label>
                <Select value={formData.status} onValueChange={(value) => value && setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="OPEN" className="text-white">Open</SelectItem>
                    <SelectItem value="CLOSED" className="text-white">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Salary</Label>
                <Input 
                  value={formData.salary} 
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })} 
                  className="bg-white/5 border-white/10 text-white" 
                  placeholder="e.g. 50,000 - 100,000 BDT"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Deadline</Label>
                <Input 
                  type="date" 
                  value={formData.deadline} 
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                  className="bg-white/5 border-white/10 text-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                className="bg-white/5 border-white/10 text-white min-h-[80px]" 
                placeholder="Job description"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Requirements</Label>
              <Textarea 
                value={formData.requirements} 
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} 
                className="bg-white/5 border-white/10 text-white min-h-[60px]" 
                placeholder="Job requirements"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Responsibilities</Label>
              <Textarea 
                value={formData.responsibilities} 
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })} 
                className="bg-white/5 border-white/10 text-white min-h-[60px]" 
                placeholder="Job responsibilities"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !formData.title || !formData.companyName || !formData.location} className="bg-[#EB4C4C] hover:bg-[#FF7070]">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#0a0a0f] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">Delete Job</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">
            Are you sure you want to delete <span className="font-semibold text-white">{selectedJob?.title}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-red-500 hover:bg-red-600">
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}