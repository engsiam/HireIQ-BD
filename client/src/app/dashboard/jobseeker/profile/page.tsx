'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/store/useAuthStore';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { Loader2, Save, Plus, X, Upload, Camera, Sparkles, FileText } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
  resumeUrl?: string;
}

export default function JobseekerProfilePage() {
  const authUser = useUser();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        if (response.data.success) {
          const data = response.data.data;
          setUser(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            skills: data.skills || [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG and WebP files are allowed');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosInstance.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setUser((prev) => prev ? { ...prev, avatar: response.data.data.avatar } : null);
        toast.success('Avatar updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploadingResume(true);
    try {
      const response = await axiosInstance.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setUser((prev) => prev ? { ...prev, resumeUrl: response.data.data.resumeUrl } : null);
        toast.success('Resume uploaded successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!formData.name) {
      toast.error('Please enter your name first');
      return;
    }

    setGeneratingBio(true);
    try {
      const response = await axiosInstance.post('/ai/bio', {
        userName: formData.name,
        userSkills: formData.skills,
        currentBio: formData.bio
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, bio: response.data.data.bio }));
        toast.success('AI bio generated!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate bio');
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.patch('/users/me', formData);
      
      if (response.data.success) {
        setUser((prev) => prev ? { ...prev, ...response.data.data } : null);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.error || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB4C4C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card className="bg-card border-border rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl font-bold">
                      {formData.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#EB4C4C] rounded-full flex items-center justify-center text-white hover:bg-[#FF7070] transition-colors disabled:opacity-50"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera size={14} />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Profile Photo</h3>
                <p className="text-muted-foreground text-sm">Upload a photo to personalize your profile</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                  placeholder="+880 123 456 7890"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Bio</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateBio}
                  disabled={generatingBio}
                  className="text-[#EB4C4C] hover:text-[#FF7070] hover:bg-[#EB4C4C]/10 h-7 px-2 text-xs gap-1.5"
                >
                  {generatingBio ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  AI Write
                </Button>
              </div>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-background text-foreground border-border placeholder:text-muted-foreground min-h-[120px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-foreground">Skills</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                placeholder="Add a skill"
              />
              <Button type="button" onClick={handleAddSkill} variant="outline" className="border-border text-foreground hover:bg-muted">
                <Plus size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} className="bg-[#EB4C4C]/20 text-[#EB4C4C] dark:bg-[#EB4C4C]/20 dark:text-[#FF7070] border-[#EB4C4C]/30 px-3 py-1">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-destructive">
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume Section */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-foreground">Resume</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {user?.resumeUrl ? (
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EB4C4C]/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#EB4C4C]" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Resume uploaded</p>
                    <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[#EB4C4C] text-sm hover:underline">
                      View current resume
                    </a>
                  </div>
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  disabled={uploadingResume}
                  className="border-border text-foreground hover:bg-muted" 
                  onClick={() => resumeInputRef.current?.click()}
                >
                  {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Replace'}
                </Button>
              </div>
            ) : (
              <div 
                className="text-center py-10 border-2 border-dashed border-border rounded-xl hover:border-[#EB4C4C]/30 transition-colors cursor-pointer"
                onClick={() => resumeInputRef.current?.click()}
              >
                {uploadingResume ? (
                  <Loader2 className="w-10 h-10 text-[#EB4C4C] animate-spin mx-auto mb-3" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">Click to upload your resume</p>
                    <p className="text-muted-foreground text-sm">PDF files only, max 10MB</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#EB4C4C] hover:bg-[#FF7070]"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}