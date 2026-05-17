'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Globe, Mail, Clock, Film, Upload, X } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [siteName, setSiteName] = useState('HireIQ BD');
  const [supportEmail, setSupportEmail] = useState('support@hireiqbd.com');
  const [heroTitle, setHeroTitle] = useState('Find Your Dream Job in Bangladesh');
  const [heroSubtitle, setHeroSubtitle] = useState('AI-powered job matching for the next generation of professionals in Bangladesh.');
  const [heroVideos, setHeroVideos] = useState<string[]>([]);
  const [sliderInterval, setSliderInterval] = useState(8);
  const [sliderAutoPlay, setSliderAutoPlay] = useState(true);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/settings');
        const settings = response.data.data;
        if (settings) {
          if (settings.siteName) setSiteName(settings.siteName);
          if (settings.supportEmail) setSupportEmail(settings.supportEmail);
          if (settings.heroTitle) setHeroTitle(settings.heroTitle);
          if (settings.heroSubtitle) setHeroSubtitle(settings.heroSubtitle);
          if (settings.heroVideos && settings.heroVideos.length > 0) setHeroVideos(settings.heroVideos);
          if (settings.sliderInterval) setSliderInterval(settings.sliderInterval);
          if (settings.sliderAutoPlay !== undefined) setSliderAutoPlay(settings.sliderAutoPlay);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('videos', files[i]);
    }

    try {
      const response = await axiosInstance.post('/settings/herovideos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setHeroVideos(response.data.data.heroVideos);
        toast.success('Video uploaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      setHeroVideos([...heroVideos, newVideoUrl.trim()]);
      setNewVideoUrl('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    setHeroVideos(heroVideos.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch('/settings', {
        siteName,
        supportEmail,
        heroTitle,
        heroSubtitle,
        heroVideos,
        sliderInterval,
        sliderAutoPlay,
      });
      if (response.data.success) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your platform settings</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#EB4C4C] hover:bg-[#FF7070]"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Info */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Site Name</Label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Support Email</Label>
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Slider Settings */}
        <Card className="bg-card border-border rounded-xl">
          <CardHeader className="border-b border-border pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Slider Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Auto-Slide Interval (seconds)</Label>
              <Input
                type="number"
                min="3"
                max="30"
                value={sliderInterval}
                onChange={(e) => setSliderInterval(Number(e.target.value))}
                className="bg-background text-foreground border-border placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={sliderAutoPlay}
                onCheckedChange={setSliderAutoPlay}
              />
              <Label className="text-foreground">Auto-play Videos</Label>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="bg-card border-border rounded-xl lg:col-span-2">
          <CardHeader className="border-b border-border pb-3 px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Film className="w-5 h-5" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Hero Title</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Hero Subtitle</Label>
                <Input
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Label className="text-foreground">Hero Videos</Label>
              <div className="flex gap-2">
                <Input
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="Enter video URL"
                  className="bg-background text-foreground border-border placeholder:text-muted-foreground"
                />
                <Button type="button" onClick={handleAddVideo} variant="outline" className="border-border text-foreground hover:bg-muted">
                  Add
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="border-border text-foreground hover:bg-muted"
              >
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload Video
              </Button>

              {heroVideos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {heroVideos.map((video, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                      <span className="text-foreground/70 text-sm truncate max-w-[200px]">{video}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}