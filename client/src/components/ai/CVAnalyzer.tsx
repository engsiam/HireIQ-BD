'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';

interface CVAnalyzerProps {
  isAuthenticated?: boolean;
}

export default function CVAnalyzer({ isAuthenticated = false }: CVAnalyzerProps) {
  const [cvText, setCvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    overallScore: number;
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    missingSkills: string[];
    improvementSuggestions: string[];
    summary: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      toast.error('Please paste your CV content');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/ai/cv-analyze', { cvText });
      setResult(response.data.data);
      toast.success('CV analysis complete!');
    } catch {
      toast.error('Failed to analyze CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          CV Analyzer
        </CardTitle>
        <CardDescription>
          Upload your CV and get AI-powered analysis with ATS scores and improvement suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cv-text">Paste your CV content</Label>
          <Textarea
            id="cv-text"
            placeholder="Paste your CV/Resume text here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={isLoading || !cvText.trim()} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze My CV
            </>
          )}
        </Button>

        {isLoading && (
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Score</span>
                  <span className="font-bold text-primary">{result.overallScore}%</span>
                </div>
                <Progress value={result.overallScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">ATS Score</span>
                  <span className="font-bold text-primary">{result.atsScore}%</span>
                </div>
                <Progress value={result.atsScore} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold">Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {result.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            {result.weaknesses.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold">Weaknesses</h4>
                <div className="flex flex-wrap gap-2">
                  {result.weaknesses.map((weakness, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      <XCircle className="w-3 h-3 mr-1" />
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {result.missingSkills.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {result.improvementSuggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold">Improvement Suggestions</h4>
                <ul className="space-y-2">
                  {result.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.summary && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <h4 className="font-bold mb-2">Summary</h4>
                <p className="text-muted-foreground">{result.summary}</p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}