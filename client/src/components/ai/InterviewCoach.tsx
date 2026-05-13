'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, MessageSquare, Briefcase, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { motion } from 'framer-motion';

interface InterviewCoachProps {
  isAuthenticated?: boolean;
}

interface InterviewPrep {
  technicalQuestions: { question: string; answer: string }[];
  behavioralQuestions: { question: string; answer: string }[];
  salaryTips: string[];
}

export default function InterviewCoach({ isAuthenticated = false }: InterviewCoachProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prep, setPrep] = useState<InterviewPrep | null>(null);

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/ai/interview-prep', {
        jobTitle,
        experience,
      });
      setPrep(response.data.data);
      toast.success('Interview prep generated!');
    } catch {
      toast.error('Failed to generate prep. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Interview Coach
        </CardTitle>
        <CardDescription>
          Practice with AI-generated interview questions and get real-time feedback on your answers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target Job Title</Label>
            <Input
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
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
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !jobTitle.trim()} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prep...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Interview Prep
            </>
          )}
        </Button>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {prep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="w-full bg-muted/30 p-1 rounded-xl">
                <TabsTrigger value="technical" className="flex-1 rounded-lg font-bold">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="behavioral" className="flex-1 rounded-lg font-bold">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Behavioral
                </TabsTrigger>
                <TabsTrigger value="salary" className="flex-1 rounded-lg font-bold">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Salary Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="mt-4">
                <Accordion className="w-full">
                  {prep.technicalQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`technical-${index}`}>
                      <AccordionTrigger className="font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="behavioral" className="mt-4">
                <Accordion className="w-full">
                  {prep.behavioralQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`behavioral-${index}`}>
                      <AccordionTrigger className="font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="salary" className="mt-4">
                <div className="space-y-3">
                  {prep.salaryTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}