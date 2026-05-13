'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/useAuthStore';

interface ApplyModalProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyModal({ job, open, onOpenChange }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (coverLetter.length < 100) {
      toast.error('Cover letter must be at least 100 characters');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to apply for this job');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resume) {
        formData.append('resume', resume);
      }

      await axiosInstance.post(`/jobs/${job.id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Application submitted successfully!');
      setIsSubmitted(true);
      setTimeout(() => {
        onOpenChange(false);
        setIsSubmitted(false);
        setCoverLetter('');
        setResume(null);
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.includes('pdf')) {
        toast.error('Only PDF files are allowed');
        return;
      }
      setResume(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Apply for {job.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Submit your application to {job.company?.name}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground">Your application has been sent successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isAuthenticated && (
              <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                <CardContent className="p-4">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    Please <a href="/login" className="underline font-bold">login</a> to apply for this job.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                placeholder="Write a compelling cover letter (minimum 100 characters)..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                {coverLetter.length}/100 characters minimum
              </p>
            </div>

            <div className="space-y-2">
              <Label>Resume (PDF)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {resume ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      <span className="font-medium">{resume.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload PDF (max 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !isAuthenticated} className="flex-1 bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}