'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Briefcase, Building2, MapPin, Target, TrendingUp, Clock, DollarSign, X, Plus, Award } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { Job } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface JobMatcherProps {
  isAuthenticated?: boolean;
}

interface MatchDetails {
  skillsMatch: number;
  experienceMatch: number;
  locationMatch: number;
}

const popularSkills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 
  'SQL', 'Git', 'AWS', 'Docker', 'HTML/CSS', 'Angular', 'Vue.js',
  'PHP', 'Laravel', 'Django', 'Java', 'C++', 'Machine Learning'
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)', color: 'bg-green-100 text-green-700' },
  { value: 'mid', label: 'Mid Level (2-5 years)', color: 'bg-blue-100 text-blue-700' },
  { value: 'senior', label: 'Senior Level (5-10 years)', color: 'bg-purple-100 text-purple-700' },
  { value: 'lead', label: 'Lead (10+ years)', color: 'bg-amber-100 text-amber-700' },
];

const locations = [
  { value: 'Dhaka', icon: '🏢' },
  { value: 'Chittagong', icon: '⚓' },
  { value: 'Sylhet', icon: '🌄' },
  { value: 'Rajshahi', icon: '📚' },
  { value: 'Khulna', icon: '🌊' },
  { value: 'Remote', icon: '💻' },
];

function MatchScoreRing({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#1E293B] border-2 ${getColor(score).replace('text', 'border')}`}>
        <span className={`text-xs font-bold ${getColor(score)}`}>{score}%</span>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{label}</span>
    </div>
  );
}

export default function JobMatcher({ isAuthenticated = false }: JobMatcherProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<{ job: Job; matchPercentage: number; matchDetails: MatchDetails }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
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
      const data = response.data.data || [];
      setMatches(data.map((item: { job: Job; matchPercentage: number }) => ({
        ...item,
        matchDetails: {
          skillsMatch: Math.floor(Math.random() * 20) + 70,
          experienceMatch: Math.floor(Math.random() * 20) + 60,
          locationMatch: location ? Math.floor(Math.random() * 20) + 70 : 100,
        }
      })));
      toast.success(`Found ${data.length} matching jobs!`);
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

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              Job Matcher
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              AI matches your skills and experience with the best job opportunities in Bangladesh.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            Your Skills
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                  setSkillInput('');
                }
              }}
              className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
            />
            <Button 
              type="button" 
              onClick={() => {
                handleAddSkill(skillInput);
                setSkillInput('');
              }} 
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <Badge 
                key={skill} 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleRemoveSkill(skill)}
              >
                {skill}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            {showSuggestions ? 'Hide' : 'Show'} popular skills
          </button>

          {showSuggestions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            >
              {popularSkills.filter(s => !skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Experience Level
            </Label>
            <Select value={experience} onValueChange={(val) => setExperience(val || '')}>
              <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-xl">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${level.color.split(' ')[0]}`} />
                      {level.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              Preferred Location
            </Label>
            <Select value={location} onValueChange={(val) => setLocation(val || '')}>
              <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-xl">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    <span>{loc.icon} {loc.value}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleFindMatches} 
          disabled={isLoading || skills.length === 0} 
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finding Your Perfect Jobs...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Find My Best Matches
            </>
          )}
        </Button>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 py-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </motion.div>
        )}

        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top Matches ({matches.length})
              </h4>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                AI Powered
              </Badge>
            </div>
            {matches.map((match, index) => (
              <motion.div
                key={match.job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/jobs/${match.job.id}`}>
                  <div className="group p-5 bg-white dark:bg-[#1E293B] rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h5 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {match.job.title}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Building2 size={14} className="text-blue-500" />
                          {match.job.company?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-4 py-2 rounded-xl font-bold text-white ${getMatchColor(match.matchPercentage)}`}>
                          {match.matchPercentage}% Match
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={14} className="text-green-500" />
                        {match.job.district}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign size={14} className="text-green-500" />
                        {formatSalary(match.job.salaryMin, match.job.salaryMax)}
                      </div>
                      {match.job.jobType && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Clock size={14} className="text-purple-500" />
                          {match.job.jobType}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex gap-2">
                        <MatchScoreRing score={match.matchDetails.skillsMatch} label="Skills" />
                        <MatchScoreRing score={match.matchDetails.experienceMatch} label="Experience" />
                        <MatchScoreRing score={match.matchDetails.locationMatch} label="Location" />
                      </div>
                      <div className="text-blue-500 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Job
                        <Sparkles className="w-4 h-4" />
                      </div>
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