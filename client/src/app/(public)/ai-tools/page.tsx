'use client';

import { useState } from 'react';
import { useIsAuthenticated } from '@/store/useAuthStore';
import CVAnalyzer from '@/components/ai/CVAnalyzer';
import JobMatcher from '@/components/ai/JobMatcher';
import InterviewCoach from '@/components/ai/InterviewCoach';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Brain, MessageSquare, Sparkles, TrendingUp, Target, Zap, ArrowRight, CheckCircle, Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'CV Analyzer',
    description: 'Get instant feedback on your CV with ATS scores and personalized improvement suggestions.',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Brain,
    title: 'Job Matcher',
    description: 'Our AI finds the best job opportunities based on your skills, experience, and preferences.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coach',
    description: 'Practice with AI-generated questions and get real-time feedback to ace your interviews.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
];

const stats = [
  { value: '50K+', label: 'CVs Analyzed', icon: FileText },
  { value: '95%', label: 'Match Accuracy', icon: Target },
  { value: '10K+', label: 'Interviews Prepped', icon: Zap },
  { value: '3x', label: 'Faster Hiring', icon: TrendingUp },
];

const benefits = [
  'AI-powered resume scoring',
  'Personalized job recommendations',
  'Mock interview practice',
  'Career growth insights',
  'Skill gap analysis',
  'Real-time feedback',
];

export default function AIToolsPage() {
  const isAuthenticated = useIsAuthenticated();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-[#FFF5F5] dark:from-[#0B1120] dark:via-[#0B1120] dark:to-[#111827]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#EB4C4C]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EB4C4C]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-16 relative">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#EB4C4C]/20 to-[#FF7070]/20 border border-[#EB4C4C]/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#EB4C4C]" />
              <span className="text-sm font-semibold text-[#EB4C4C]">Powered by Groq AI</span>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
              Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EB4C4C] to-[#FF7070]">Career</span>
              <br className="hidden md:block" /> With AI Power
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
              Use our advanced AI tools to analyze your CV, find the perfect job matches, and prepare for interviews to land your dream job.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-12"
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 text-center border border-gray-200/50 dark:border-gray-700/50 hover:border-[#EB4C4C]/30 transition-all hover:shadow-lg hover:shadow-[#EB4C4C]/10"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] flex items-center justify-center shadow-lg shadow-[#EB4C4C]/20">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={isAuthenticated ? "#tools" : "/register"}>
              <Button className="h-14 px-8 bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] hover:from-[#d43e3e] hover:to-[#e65f5f] text-white font-bold rounded-2xl shadow-lg shadow-[#EB4C4C]/25 hover:shadow-[#EB4C4C]/40 transition-all">
                <Play className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="h-14 px-8 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 transition-all">
                Explore Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Auth Warning */}
      {!isAuthenticated && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Unlock Full Features</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sign in to save your analysis history and access all AI features.
                    </p>
                  </div>
                  <Link href="/login" className="shrink-0">
                    <Button className="bg-[#EB4C4C] hover:bg-[#FF7070] text-white font-bold rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* AI Tools Section */}
      <div id="tools" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            AI-Powered <span className="text-[#EB4C4C]">Tools</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Choose a tool to get started with your career journey
          </p>
        </motion.div>

        {/* Tool Tabs */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 justify-center">
          {features.map((feature, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all overflow-hidden ${
                activeTab === i
                  ? 'text-white'
                  : 'bg-white dark:bg-[#1E293B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#EB4C4C]/50'
              }`}
            >
              {activeTab === i && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#EB4C4C] to-[#FF7070]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeTab === i 
                  ? 'bg-white/20' 
                  : feature.bgColor
              }`}>
                <feature.icon className={`w-5 h-5 ${activeTab === i ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
              </div>
              <span className="relative z-10">{feature.title}</span>
            </button>
          ))}
        </div>

        {/* Tool Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === 0 && <CVAnalyzer isAuthenticated={isAuthenticated} />}
          {activeTab === 1 && <JobMatcher isAuthenticated={isAuthenticated} />}
          {activeTab === 2 && <InterviewCoach isAuthenticated={isAuthenticated} />}
        </motion.div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Everything You <span className="text-[#EB4C4C]">Need</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">
            Comprehensive tools to boost your job search
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveTab(i)}
              className="group relative bg-white dark:bg-[#1E293B] rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-800 cursor-pointer hover:border-[#EB4C4C] hover:shadow-2xl hover:shadow-[#EB4C4C]/10 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EB4C4C]/0 to-[#EB4C4C]/0 group-hover:from-[#EB4C4C]/5 group-hover:to-[#FF7070]/5 transition-all duration-300" />
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#EB4C4C] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-[#EB4C4C] font-semibold">
                  Try Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-[#EB4C4C]/5 to-[#FF7070]/5 dark:from-[#EB4C4C]/10 dark:to-[#FF7070]/10 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
                Why Choose <span className="text-[#EB4C4C]">HireIQ AI</span>?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Our AI-powered tools are designed to help you land your dream job faster and more efficiently than ever before.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#EB4C4C]/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#EB4C4C]" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#EB4C4C]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FF7070]/20 rounded-full blur-2xl" />
              <Card className="relative bg-white dark:bg-[#1E293B] border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] flex items-center justify-center shadow-lg shadow-[#EB4C4C]/30">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Start Free</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">No credit card required</p>
                    <Link href={isAuthenticated ? "#tools" : "/register"}>
                      <Button className="w-full h-12 bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] text-white font-bold rounded-xl">
                        Get Started Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#EB4C4C]/10 rounded-full">
            <Sparkles className="w-5 h-5 text-[#EB4C4C]" />
            <span className="text-sm font-semibold text-[#EB4C4C]">Used by 50,000+ job seekers in Bangladesh</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}