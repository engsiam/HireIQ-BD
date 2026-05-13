'use client';

import { useState } from 'react';
import { useAuthStore, useIsAuthenticated } from '@/store/useAuthStore';
import CVAnalyzer from '@/components/ai/CVAnalyzer';
import JobMatcher from '@/components/ai/JobMatcher';
import InterviewCoach from '@/components/ai/InterviewCoach';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Brain, MessageSquare, Lock, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'CV Analyzer',
    description: 'Get instant feedback on your CV with ATS scores and personalized improvement suggestions.',
    color: 'bg-red-100 dark:bg-red-900/20',
    iconColor: 'text-red-500',
  },
  {
    icon: Brain,
    title: 'Job Matcher',
    description: 'Our AI finds the best job opportunities based on your skills, experience, and preferences.',
    color: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coach',
    description: 'Practice with AI-generated questions and get tips on how to ace your interviews.',
    color: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-500',
  },
];

const stats = [
  { value: '50K+', label: 'CVs Analyzed', icon: FileText },
  { value: '95%', label: 'Match Accuracy', icon: Target },
  { value: '10K+', label: 'Interviews Prepped', icon: Zap },
  { value: '3x', label: 'Faster Hiring', icon: TrendingUp },
];

export default function AIToolsPage() {
  const isAuthenticated = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState('cv-analyzer');

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-white to-[#FFF5F5] dark:from-[#0B1120] dark:to-[#111827]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EB4C4C]/10 border border-[#EB4C4C]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#EB4C4C]" />
            <span className="text-sm font-semibold text-[#EB4C4C]">Powered by Google Gemini</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mt-4">
            Supercharge Your <span className="text-[#EB4C4C]">Career</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Use our AI tools to analyze your CV, find the perfect job matches, and prepare for interviews.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800"
            >
              <stat.icon className="w-6 h-6 text-[#EB4C4C] mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Auth Warning */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center shrink-0">
                    <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-amber-900 dark:text-amber-200">Unlock Full Features</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Sign in to save your analysis history and access all AI features.
                    </p>
                  </div>
                  <Link href="/login" className="px-6 py-3 bg-[#EB4C4C] text-white rounded-xl font-bold hover:bg-[#d43e3e] transition-colors shrink-0">
                    Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl mb-8 flex justify-center gap-2">
            {features.map((feature, i) => (
              <TabsTrigger 
                key={i}
                value={i === 0 ? 'cv-analyzer' : i === 1 ? 'job-matcher' : 'interview-coach'}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === (i === 0 ? 'cv-analyzer' : i === 1 ? 'job-matcher' : 'interview-coach')
                    ? 'bg-white dark:bg-[#1E293B] text-[#EB4C4C] shadow-lg'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <feature.icon className="w-4 h-4" />
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="cv-analyzer">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="max-w-4xl mx-auto">
                <CVAnalyzer isAuthenticated={isAuthenticated} />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="job-matcher">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="max-w-4xl mx-auto">
                <JobMatcher isAuthenticated={isAuthenticated} />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="interview-coach">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="max-w-4xl mx-auto">
                <InterviewCoach isAuthenticated={isAuthenticated} />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => setActiveTab(i === 0 ? 'cv-analyzer' : i === 1 ? 'job-matcher' : 'interview-coach')}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-[#EB4C4C] hover:shadow-xl transition-all group"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#EB4C4C]/10 rounded-full">
            <Sparkles className="w-5 h-5 text-[#EB4C4C]" />
            <span className="text-sm font-semibold text-[#EB4C4C]">Used by 50,000+ job seekers in Bangladesh</span>
          </div>
        </div>
      </div>
    </div>
  );
}