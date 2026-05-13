'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const aiTools = [
  {
    id: 'cv-analyzer',
    title: 'AI CV Analyzer',
    description: 'Upload your CV and get AI-powered feedback to improve your chances of landing your dream job.',
    icon: FileText,
    href: '/ai-tools/#ai-cv-analyzer',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'interview-coach',
    title: 'AI Interview Coach',
    description: 'Practice with our AI-powered interview coach and get instant feedback on your responses.',
    icon: MessageSquare,
    href: '/ai-tools/#ai-interview-coach',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'job-matcher',
    title: 'AI Job Matcher',
    description: 'Let our AI match you with the perfect jobs based on your skills and preferences.',
    icon: Sparkles,
    href: '/ai-tools/#ai-job-matcher',
    color: 'from-[#EB4C4C] to-[#FF7070]',
    bgColor: 'bg-[#EB4C4C]/10',
  },
];

export default function AIToolsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">AI Tools</h1>
        <p className="text-white/50 text-sm">Supercharge your job search with AI-powered tools</p>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all hover:shadow-xl hover:shadow-[#EB4C4C]/5 group"
          >
            <CardHeader className="p-6">
              <div className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-7 h-7 text-white/80" />
              </div>
              <CardTitle className="text-xl font-bold text-white">{tool.title}</CardTitle>
              <CardDescription className="text-white/50">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Link href={tool.href}>
                <Button className="w-full bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] hover:from-[#FF7070] hover:to-[#EB4C4C] group-hover:scale-[1.02] transition-transform">
                  Try Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <CardHeader className="border-b border-white/5 pb-3 px-6 pt-6">
          <CardTitle className="text-lg font-semibold text-white">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#EB4C4C]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-[#EB4C4C] font-bold">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Upload Your CV</h3>
              <p className="text-white/50 text-sm">Simply upload your resume or paste your work experience.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#EB4C4C]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-[#EB4C4C] font-bold">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-white/50 text-sm">Our AI analyzes your profile and provides personalized recommendations.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#EB4C4C]/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-[#EB4C4C] font-bold">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Get Hired</h3>
              <p className="text-white/50 text-sm">Use insights to improve your applications and land your dream job.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}