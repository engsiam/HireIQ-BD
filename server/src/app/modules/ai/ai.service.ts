import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../../../prisma/client';
import env from '../../../config';

const getGeminiModel = () => {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const parseGeminiJSON = <T>(text: string): T => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/) || cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        throw new Error('AI returned invalid JSON. Please try again.');
      }
    }
    throw new Error('AI returned invalid JSON. Please try again.');
  }
};

export const analyzeCV = async (cvText: string, jobTitle?: string) => {
  const model = getGeminiModel();

  const prompt = `
You are an expert HR consultant and ATS specialist for the Bangladesh job market.
Analyze this CV${jobTitle ? ` for a ${jobTitle} position` : ''} and return ONLY valid JSON (no markdown, no explanation):

CV Text:
${cvText.substring(0, 4000)}

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missingSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "improvementSuggestions": [
    "<specific actionable suggestion 1>",
    "<specific actionable suggestion 2>",
    "<specific actionable suggestion 3>",
    "<specific actionable suggestion 4>"
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseGeminiJSON<{
    overallScore: number; atsScore: number; summary: string;
    strengths: string[]; weaknesses: string[]; missingSkills: string[];
    improvementSuggestions: string[];
  }>(text);
};

export const matchJobs = async (skills: string[], experience: string, preferredLocation?: string) => {
  const model = getGeminiModel();

  const jobs = await prisma.job.findMany({
    where: { status: 'OPEN' },
    take: 30,
    select: {
      id: true,
      title: true,
      companyName: true,
      district: true,
      salary: true,
      skills: true,
    },
  });

  const prompt = `
You are a job matching AI for Bangladesh job market.
Candidate profile:
- Skills: ${skills.join(', ')}
- Experience: ${experience}
- Preferred location: ${preferredLocation || 'Any'}

Available jobs:
${JSON.stringify(jobs, null, 2)}

Return ONLY valid JSON (no markdown):
{
  "matches": [
    {
      "jobId": "<job id>",
      "matchScore": <number 0-100>,
      "matchReason": "<1-2 sentence explanation>",
      "skillGap": ["<missing skill 1>", "<missing skill 2>"]
    }
  ]
}
Return top 5 matches ordered by matchScore descending.`;

  const result = await model.generateContent(prompt);
  const parsed = parseGeminiJSON<{ matches: Array<{ jobId: string; matchScore: number; matchReason: string; skillGap: string[] }> }>(result.response.text());

  const hydratedMatches = await Promise.all(
    parsed.matches.map(async (match) => {
      const job = await prisma.job.findUnique({ where: { id: match.jobId } });
      return { ...match, job };
    })
  );

  return hydratedMatches.filter(m => m.job !== null);
};

export const generateInterviewPrep = async (jobTitle: string, experienceLevel: string, jobDescription?: string) => {
  const model = getGeminiModel();

  const prompt = `
You are an expert interview coach for Bangladesh job market.
Generate interview preparation for: ${jobTitle} (${experienceLevel} level)
${jobDescription ? `Job description context: ${jobDescription.substring(0, 500)}` : ''}

Return ONLY valid JSON (no markdown):
{
  "technicalQuestions": [
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" }
  ],
  "behavioralQuestions": [
    { "question": "<question>", "tip": "<how to answer this type of question>" },
    { "question": "<question>", "tip": "<tip>" },
    { "question": "<question>", "tip": "<tip>" }
  ],
  "salaryNegotiationTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "companyResearchTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

  const result = await model.generateContent(prompt);
  return parseGeminiJSON<{
    technicalQuestions: Array<{ question: string; modelAnswer: string; difficulty: string }>;
    behavioralQuestions: Array<{ question: string; tip: string }>;
    salaryNegotiationTips: string[];
    companyResearchTips: string[];
  }>(result.response.text());
};

export const chatWithAI = async (prompt: string, history: { role: string; content: string }[] = []) => {
  const model = getGeminiModel();

  const systemPrompt = `You are HireIQ's career assistant for Bangladesh job seekers and employers.
Help with: job search, CV writing, interview preparation, career advice, salary expectations in Bangladesh.
Be professional, helpful, and concise. Keep responses under 200 words.`;

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.map(h => ({
        role: h.role === 'model' ? 'model' as const : 'user' as const,
        parts: [{ text: h.content }],
      })),
    ],
    generationConfig: { maxOutputTokens: 1000 },
  });

  const result = await chat.sendMessage(prompt);
  return { response: result.response.text() };
};