'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    type: 'FULL_TIME',
    category: 'Technology',
    location: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: `${formData.salaryMin} - ${formData.salaryMax} BDT`,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
        deadline: new Date(formData.deadline).toISOString(),
      };

      const response = await axiosInstance.post('/jobs', payload);
      
      if (response.data.success) {
        toast.success('Job posted successfully!');
        router.push('/dashboard/employer/jobs');
      } else {
        toast.error(response.data.error || 'Failed to post job');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Post New Job</h1>
        <p className="text-muted-foreground text-sm">Fill in the details to create a new job listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Job Title *</Label>
              <Input
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Job Type *</Label>
                <Select value={formData.type} onValueChange={(value) => value && setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="FULL_TIME" className="text-foreground">Full Time</SelectItem>
                    <SelectItem value="PART_TIME" className="text-foreground">Part Time</SelectItem>
                    <SelectItem value="REMOTE" className="text-foreground">Remote</SelectItem>
                    <SelectItem value="INTERNSHIP" className="text-foreground">Internship</SelectItem>
                    <SelectItem value="CONTRACT" className="text-foreground">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => value && setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Technology" className="text-foreground">Technology</SelectItem>
                    <SelectItem value="Finance" className="text-foreground">Finance</SelectItem>
                    <SelectItem value="Marketing" className="text-foreground">Marketing</SelectItem>
                    <SelectItem value="Healthcare" className="text-foreground">Healthcare</SelectItem>
                    <SelectItem value="Education" className="text-foreground">Education</SelectItem>
                    <SelectItem value="Engineering" className="text-foreground">Engineering</SelectItem>
                    <SelectItem value="Design" className="text-foreground">Design</SelectItem>
                    <SelectItem value="Sales" className="text-foreground">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Location *</Label>
              <Input
                placeholder="e.g. Dhaka, Bangladesh"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Job Description *</Label>
              <Textarea
                placeholder="Describe the job role and responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Requirements</Label>
              <Textarea
                placeholder="List the required skills and qualifications..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Responsibilities</Label>
              <Textarea
                placeholder="List the key responsibilities..."
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Required Skills (comma separated)</Label>
              <Input
                placeholder="e.g. React, Node.js, TypeScript"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Salary & Deadline */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-4 pt-4">
            <CardTitle className="text-base font-semibold text-foreground">Salary & Deadline</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Min Salary (BDT)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Max Salary (BDT)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 100000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Application Deadline *</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}