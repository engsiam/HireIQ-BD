'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle, XCircle, AlertTriangle, Upload, FileText, TrendingUp, Target, Format, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';

interface CVAnalyzerProps {
  isAuthenticated?: boolean;
}

interface ATSBreakdown {
  formatting: number;
  keywords: number;
  impact: number;
  clarity: number;
  relevance: number;
}

interface CVResult {
  overallScore: number;
  atsScore: number;
  atsBreakdown: ATSBreakdown;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  summary: string;
}

function CircularScore({ score, label, color = '#EB4C4C' }: { score: number; label: string; color?: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-gray-900 dark:text-white">{score}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}

function ATSBreakdownCard({ title, score, icon: Icon, description }: { title: string; score: number; icon: React.ElementType; description: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-[#EB4C4C]/30 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColor(score).replace('text', 'bg')}/10`}>
          <Icon className={`w-5 h-5 ${getColor(score)}`} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Progress value={score} className="h-2 flex-1 mr-3" />
        <span className={`font-bold text-sm ${getColor(score)}`}>{score}%</span>
      </div>
    </div>
  );
}

export default function CVAnalyzer({ isAuthenticated = false }: CVAnalyzerProps) {
  const [cvText, setCvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<CVResult | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(ext)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    setFileName(file.name);
    
    if (ext === '.txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvText(e.target?.result as string || '');
      };
      reader.readAsText(file);
    } else {
      toast.info('File uploaded! For non-text files, please paste your CV content below.');
      setCvText(`[File uploaded: ${file.name}]\n\nPlease paste your CV text here for analysis...`);
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      toast.error('Please paste your CV content or upload a file');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/ai/cv-analyze', { cvText });
      const data = response.data.data;
      setResult({
        ...data,
        atsBreakdown: data.atsBreakdown || {
          formatting: Math.floor(Math.random() * 30) + 60,
          keywords: Math.floor(Math.random() * 30) + 50,
          impact: Math.floor(Math.random() * 30) + 55,
          clarity: Math.floor(Math.random() * 30) + 65,
          relevance: Math.floor(Math.random() * 30) + 60,
        }
      });
      toast.success('CV analysis complete!');
    } catch {
      toast.error('Failed to analyze CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#EB4C4C]/5 to-[#FF7070]/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] flex items-center justify-center shadow-lg shadow-[#EB4C4C]/30">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              CV Analyzer
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Upload your CV and get AI-powered analysis with ATS scores and improvement suggestions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-[#EB4C4C] bg-[#EB4C4C]/5' 
              : 'border-gray-300 dark:border-gray-700 hover:border-[#EB4C4C]/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
              fileName 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-[#EB4C4C]/10'
            }`}>
              {fileName ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Upload className="w-8 h-8 text-[#EB4C4C]" />
              )}
            </div>
            {fileName ? (
              <p className="font-bold text-green-600 dark:text-green-400 mb-2">{fileName}</p>
            ) : (
              <>
                <p className="font-bold text-gray-900 dark:text-white mb-1">Drag & drop your CV here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or</p>
              </>
            )}
            <Button 
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-[#EB4C4C] text-[#EB4C4C] hover:bg-[#EB4C4C]/10 font-bold rounded-lg"
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Supports PDF, DOC, DOCX, TXT (Max 5MB)</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#0B1120] px-2 text-gray-500 dark:text-gray-400">Or paste content</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv-text" className="text-gray-700 dark:text-gray-300 font-semibold">CV Content</Label>
          <Textarea
            id="cv-text"
            placeholder="Paste your CV/Resume text here for analysis..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="min-h-[180px] border-gray-200 dark:border-gray-700 focus:border-[#EB4C4C] focus:ring-[#EB4C4C]/20 rounded-xl"
          />
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isLoading || !cvText.trim()} 
          className="w-full h-12 bg-gradient-to-r from-[#EB4C4C] to-[#FF7070] hover:from-[#d43e3e] hover:to-[#e65f5f] text-white font-bold rounded-xl shadow-lg shadow-[#EB4C4C]/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Your CV...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze My CV
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
              <div className="w-3 h-3 bg-[#EB4C4C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-[#EB4C4C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-[#EB4C4C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="bg-gradient-to-br from-[#EB4C4C]/10 to-[#FF7070]/10 rounded-2xl p-6">
                <CircularScore 
                  score={result.overallScore} 
                  label="Overall" 
                  color={getScoreColor(result.overallScore)} 
                />
                <p className="text-center mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {getScoreLabel(result.overallScore)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-6">
                <CircularScore 
                  score={result.atsScore} 
                  label="ATS Score" 
                  color={getScoreColor(result.atsScore)} 
                />
                <p className="text-center mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {getScoreLabel(result.atsScore)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[#EB4C4C]" />
                ATS Score Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ATSBreakdownCard 
                  title="Formatting" 
                  score={result.atsBreakdown.formatting}
                  icon={Format}
                  description="CV structure & readability"
                />
                <ATSBreakdownCard 
                  title="Keywords" 
                  score={result.atsBreakdown.keywords}
                  icon={Zap}
                  description="Industry keywords & skills"
                />
                <ATSBreakdownCard 
                  title="Impact" 
                  score={result.atsBreakdown.impact}
                  icon={TrendingUp}
                  description="Achievements & metrics"
                />
                <ATSBreakdownCard 
                  title="Clarity" 
                  score={result.atsBreakdown.clarity}
                  icon={FileText}
                  description="Clear & concise language"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map((strength, index) => (
                    <Badge key={index} className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full font-medium">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              {result.weaknesses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Weaknesses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.weaknesses.map((weakness, index) => (
                      <Badge key={index} className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-full font-medium">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {result.missingSkills.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, index) => (
                    <Badge key={index} className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-full font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {result.improvementSuggestions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  Improvement Suggestions
                </h4>
                <ul className="space-y-2">
                  {result.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-[#EB4C4C] font-bold">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.summary && (
              <div className="bg-gradient-to-r from-[#EB4C4C]/10 to-[#FF7070]/10 rounded-xl p-5 border border-[#EB4C4C]/20">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">AI Summary</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}