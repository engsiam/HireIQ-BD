'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Briefcase, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface JobMatcherProps {
  isAuthenticated?: boolean;
}

export default function JobMatcher({ isAuthenticated = false }: JobMatcherProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<{ job: Job; matchPercentage: number }[]>([]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleFindMatches = async () => {
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/ai/job-match', {
        skills,
        experience,
        location,
      });
      setMatches(response.data.data || []);
      toast.success(`Found ${matches.length} matching jobs!`);
    } catch {
      toast.error('Failed to find matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Negotiable';
    const format = (num: number) => `৳${(num / 1000).toFixed(0)}k`;
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Job Matcher
        </CardTitle>
        <CardDescription>
          AI matches your skills and experience with the best job opportunities in Bangladesh.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">Add</Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                  {skill} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Experience Level</Label>
            <Select value={experience} onValueChange={(val) => setExperience(val || 'entry')}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                <SelectItem value="senior">Senior Level (5-10 years)</SelectItem>
                <SelectItem value="lead">Lead (10+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preferred Location</Label>
            <Select value={location} onValueChange={(val) => setLocation(val || 'Dhaka')}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dhaka">Dhaka</SelectItem>
                <SelectItem value="Chittagong">Chittagong</SelectItem>
                <SelectItem value="Sylhet">Sylhet</SelectItem>
                <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                <SelectItem value="Khulna">Khulna</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleFindMatches} 
          disabled={isLoading || skills.length === 0} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Matches...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Find My Best Matches
            </>
          )}
        </Button>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h4 className="font-bold">Top Matches ({matches.length})</h4>
            {matches.map((match, index) => (
              <motion.div
                key={match.job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/jobs/${match.job.id}`}>
                  <div className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h5 className="font-bold">{match.job.title}</h5>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 size={14} />
                          {match.job.company?.name}
                        </p>
                      </div>
                      <Badge className="bg-primary text-white">
                        {match.matchPercentage}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin size={14} />
                        {match.job.district}
                      </span>
                      <span className="font-bold text-primary">
                        {formatSalary(match.job.salaryMin, match.job.salaryMax)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}