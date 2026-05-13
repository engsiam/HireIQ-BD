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
import { Loader2, Save, Plus, X, Upload, Camera } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          setUser(response.data.data);
          setFormData({
            name: response.data.data.name || '',
            email: response.data.data.email || '',
            phone: response.data.data.phone || '',
            location: response.data.data.location || '',
            bio: response.data.data.bio || '',
            skills: response.data.data.skills || [],
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
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-white/50 text-sm">Manage your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40 text-2xl font-bold">
                      {formData.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
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
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold">Profile Photo</h3>
                <p className="text-white/50 text-sm">Upload a photo to personalize your profile</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardHeader className="border-b border-white/5 pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  placeholder="your@email.com"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  placeholder="+880 123 456 7890"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[120px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardHeader className="border-b border-white/5 pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-white">Skills</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                placeholder="Add a skill"
              />
              <Button type="button" onClick={handleAddSkill} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Plus size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} className="bg-[#EB4C4C]/20 text-[#EB4C4C] border-[#EB4C4C]/30 px-3 py-1">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-white">
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume Section */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <CardHeader className="border-b border-white/5 pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-white">Resume</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {user?.resumeUrl ? (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#EB4C4C]/20 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#EB4C4C]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Resume uploaded</p>
                    <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-[#EB4C4C] text-sm hover:underline">
                      View resume
                    </a>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => fileInputRef.current?.click()}>
                  Replace
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-white/20 rounded-lg">
                <Upload className="w-10 h-10 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 mb-2">Upload your resume</p>
                <p className="text-white/30 text-sm">PDF files only, max 10MB</p>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={(el) => {
                if (el) fileInputRef.current = el;
              }}
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