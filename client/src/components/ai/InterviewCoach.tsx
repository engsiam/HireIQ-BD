'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, MessageSquare, Briefcase, DollarSign, CheckCircle, Clock, Target, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/store/useAuthStore';

interface InterviewCoachProps {
  isAuthenticated?: boolean;
}

interface Question {
  question: string;
  answer: string;
  modelAnswer?: string;
  category?: string;
  difficulty?: string;
}

interface InterviewPrep {
  technicalQuestions: Question[];
  behavioralQuestions: Question[];
  salaryTips: string[];
  companyResearchTips: string[];
}

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'mid', label: 'Mid Level (2-5 years)', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'senior', label: 'Senior Level (5-10 years)', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'lead', label: 'Lead (10+ years)', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
];

function QuestionCard({ question, index, color }: { question: Question; index: number; color: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold text-sm">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">{question.question}</p>
            {question.difficulty && (
              <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                question.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {question.difficulty}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
<div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700">
               <div className="pt-4">
                 <p className="text-sm font-medium text-purple-500 mb-2 flex items-center gap-2">
                   <CheckCircle className="w-4 h-4" />
                   Sample Answer
                 </p>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                   {question.modelAnswer || question.answer}
                 </p>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InterviewCoach({ isAuthenticated = false }: InterviewCoachProps) {
  const user = useUser();
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [activeTab, setActiveTab] = useState('technical');

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      toast.error('Please login as a Job Seeker to use AI tools');
      return;
    }
    if (user?.role !== 'JOBSEEKER') {
      toast.error('This feature is only available for Job Seekers');
      return;
    }
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/ai/interview-prep', {
        jobTitle,
        experienceLevel: experience || 'mid',
      });
      const data = response.data.data;
      const capDifficulty = (d?: string) =>
        d ? d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() : undefined;
      setPrep({
        technicalQuestions: (data.technicalQuestions || []).map(
          (q: Question & { modelAnswer?: string }) => ({
            ...q,
            difficulty: capDifficulty(q.difficulty),
          })
        ),
        behavioralQuestions: data.behavioralQuestions || [],
        salaryTips: data.salaryNegotiationTips || data.salaryTips || [],
        companyResearchTips: data.companyResearchTips || [],
      });
      toast.success('Interview prep generated!');
    } catch {
      toast.error('Failed to generate prep. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalQuestions = () => {
    if (!prep) return 0;
    return prep.technicalQuestions.length + prep.behavioralQuestions.length;
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              Interview Coach
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Practice with AI-generated interview questions and get real-time feedback on your answers.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Target Job Title
            </Label>
            <Input
              placeholder="e.g. Software Engineer, Marketing Manager..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl h-12"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-500" />
              Experience Level
            </Label>
            <Select value={experience} onValueChange={(val) => setExperience(val || '')}>
              <SelectTrigger className="border-gray-200 dark:border-gray-700 rounded-xl h-12">
                <SelectValue placeholder="Select level" />
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
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !jobTitle.trim()} 
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Your Prep...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Interview Prep
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
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          </motion.div>
        )}

        {prep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                  Your Interview Prep for {jobTitle}
                </h4>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {getTotalQuestions()} Questions
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white dark:bg-[#1E293B] rounded-xl">
                  <p className="text-2xl font-black text-purple-500">{prep.technicalQuestions.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Technical</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-[#1E293B] rounded-xl">
                  <p className="text-2xl font-black text-pink-500">{prep.behavioralQuestions.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Behavioral</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-[#1E293B] rounded-xl">
                  <p className="text-2xl font-black text-amber-500">
                    {prep.salaryTips.length + prep.companyResearchTips.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tips and research</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => setActiveTab('technical')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'technical'
                    ? 'bg-white dark:bg-[#1E293B] text-purple-500 shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Technical ({prep.technicalQuestions.length})
              </button>
              <button
                onClick={() => setActiveTab('behavioral')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'behavioral'
                    ? 'bg-white dark:bg-[#1E293B] text-pink-500 shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Behavioral ({prep.behavioralQuestions.length})
              </button>
              <button
                onClick={() => setActiveTab('salary')}
                className={`flex-1 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'salary'
                    ? 'bg-white dark:bg-[#1E293B] text-amber-500 shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Tips ({prep.salaryTips.length + prep.companyResearchTips.length})
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'technical' && (
                  <div className="space-y-3">
                    {prep.technicalQuestions.map((q, i) => (
                      <QuestionCard 
                        key={i} 
                        question={q} 
                        index={i}
                        color="bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'behavioral' && (
                  <div className="space-y-3">
                    {prep.behavioralQuestions.map((q, i) => (
                      <QuestionCard 
                        key={i} 
                        question={q} 
                        index={i}
                        color="bg-gradient-to-r from-pink-500 to-rose-500"
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'salary' && (
                  <div className="space-y-6">
                    {prep.salaryTips.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300">Salary negotiation</h5>
                        {prep.salaryTips.map((tip, index) => (
                          <motion.div
                            key={`s-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {prep.companyResearchTips.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300">Company research</h5>
                        {prep.companyResearchTips.map((tip, index) => (
                          <motion.div
                            key={`c-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}