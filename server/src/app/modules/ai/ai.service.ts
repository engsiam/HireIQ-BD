import Groq from 'groq-sdk';
import prisma from '../../../prisma/client';
import env from '../../../config';

const JSON_SYSTEM = `You are a precise assistant. Respond with ONLY valid JSON exactly as requested — no markdown code fences, no commentary before or after the JSON.`;

let groqClient: Groq | null = null;

const getGroq = (): Groq => {
  if (!env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return groqClient;
};

const groqModel = () => env.GROQ_MODEL || 'llama-3.3-70b-versatile';

async function groqJsonCompletion(userPrompt: string, maxTokens = 8192): Promise<string> {
  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    model: groqModel(),
    messages: [
      { role: 'system', content: JSON_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: maxTokens,
  });
  const text = completion.choices[0]?.message?.content;
  if (!text?.trim()) {
    throw new Error('AI returned empty response');
  }
  return text;
}

async function groqChatCompletion(
  messages: Groq.Chat.Completions.ChatCompletionMessageParam[],
  maxTokens = 1000
): Promise<string> {
  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    model: groqModel(),
    messages,
    temperature: 0.5,
    max_tokens: maxTokens,
  });
  return completion.choices[0]?.message?.content?.trim() ?? '';
}

const PLAIN_TEXT_SYSTEM = `You are a professional writer. Follow the user's instructions exactly. Output plain text only—no markdown code fences, no preamble or explanation.`;

async function groqPlainTextCompletion(userPrompt: string, maxTokens = 2000): Promise<string> {
  return groqChatCompletion(
    [
      { role: 'system', content: PLAIN_TEXT_SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    maxTokens
  );
}

const parseAIJson = <T>(text: string): T => {
  const cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s*```\s*$/g, '')
    .replace(/^\s*```json\s*$/g, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/) || cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        try {
          const fixed = jsonMatch[0]
            .replace(/:\s*'/g, ': "')
            .replace(/'\s*([,}\]])/g, '"$1')
            .replace(/,\s*([}\]])/g, '$1');
          return JSON.parse(fixed) as T;
        } catch {
          throw new Error('AI returned invalid JSON. Please try again.');
        }
      }
    }
    throw new Error('AI returned invalid JSON. Please try again.');
  }
};

export const analyzeCV = async (cvText: string, jobTitle?: string) => {
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

  const text = await groqJsonCompletion(prompt);
  return parseAIJson<{
    overallScore: number; atsScore: number; summary: string;
    strengths: string[]; weaknesses: string[]; missingSkills: string[];
    improvementSuggestions: string[];
  }>(text);
};

export const matchJobs = async (skills: string[], experience: string, preferredLocation?: string) => {
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
        "matchPercentage": <number 0-100>,
        "matchReason": "<1-2 sentence explanation>",
        "skillGap": ["<missing skill 1>", "<missing skill 2>"]
      }
    ]
  }
  Return top 5 matches ordered by matchPercentage descending.`;

  const text = await groqJsonCompletion(prompt);
  const parsed = parseAIJson<{ matches: Array<{ jobId: string; matchPercentage: number; matchReason: string; skillGap: string[] }> }>(text);

  const hydratedMatches = await Promise.all(
    parsed.matches.map(async (match) => {
      const job = await prisma.job.findUnique({ where: { id: match.jobId } });
      return { ...match, job };
    })
  );

  return hydratedMatches.filter(m => m.job !== null);
};

export const generateInterviewPrep = async (jobTitle: string, experienceLevel: string, jobDescription?: string) => {
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
     { "question": "<question>", "answer": "<how to answer this type of question>" },
     { "question": "<question>", "answer": "<answer>" },
     { "question": "<question>", "answer": "<answer>" }
   ],
  "salaryNegotiationTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "companyResearchTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

  const text = await groqJsonCompletion(prompt);
  const parsed = parseAIJson<{
    technicalQuestions: Array<{ question: string; modelAnswer: string; difficulty: string }>;
    behavioralQuestions: Array<{ question: string; answer?: string; tip?: string }>;
    salaryNegotiationTips: string[];
    companyResearchTips: string[];
  }>(text);

  return {
    ...parsed,
    behavioralQuestions: parsed.behavioralQuestions.map((bq) => ({
      question: bq.question,
      answer: bq.answer || bq.tip || '',
    })),
  };
};

export const chatWithAI = async (prompt: string, history: { role: string; content: string }[] = []) => {
  const systemPrompt = `You are HireIQ's career assistant for Bangladesh job seekers and employers.
Help with: job search, CV writing, interview preparation, career advice, salary expectations in Bangladesh.
Be professional, helpful, and concise. Keep responses under 200 words.`;

  const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({
      role: h.role === 'model' || h.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: h.content,
    })),
    { role: 'user', content: prompt },
  ];

  const text = await groqChatCompletion(messages, 1000);
  return { response: text };
};

export const generateCoverLetter = async (
  jobTitle: string,
  companyName: string,
  userName: string,
  userSkills: string[],
  userExperience?: string,
  jobRequirements?: string[]
) => {
  const prompt = `
You are a professional career counselor specializing in the Bangladesh job market.
Generate a compelling cover letter for a job application.

Job Details:
- Position: ${jobTitle}
- Company: ${companyName}
- Requirements: ${jobRequirements?.join(', ') || 'Not specified'}

Candidate Profile:
- Name: ${userName}
- Skills: ${userSkills.join(', ') || 'Not specified'}
- Experience: ${userExperience || 'Not specified'}

Requirements:
- Write in professional but warm tone
- Keep it concise (200-300 words)
- Highlight relevant skills and experience
- Show enthusiasm for the role
- Include a strong opening, body, and closing
- Do NOT include placeholders like [Your Name] - use the actual name provided
- Do NOT use bullet points or lists - write as flowing paragraphs
- The cover letter should be ready to submit without any editing needed

Return ONLY the cover letter text (no JSON, no markdown):`;

  const text = await groqPlainTextCompletion(prompt, 1500);
  return { coverLetter: text };
};

export const generateBio = async (
  userName: string,
  userSkills: string[],
  currentBio?: string
) => {
  const prompt = `
You are a professional profile writer. 
Generate a professional, engaging, and concise bio (around 50-100 words) for a user profile on HireIQ BD, a job board in Bangladesh.

User Details:
- Name: ${userName}
- Skills: ${userSkills.join(', ') || 'Not specified'}
- Current Bio/Context: ${currentBio || 'Not specified'}

Requirements:
- Professional yet personable tone
- Focus on key strengths and value proposition
- Mention top skills naturally
- Keep it under 100 words
- Return ONLY the bio text, no preamble or quotes.
`;

  const text = await groqPlainTextCompletion(prompt, 500);
  return { bio: text };
};
