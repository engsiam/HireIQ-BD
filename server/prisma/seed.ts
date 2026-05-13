import { PrismaClient, Role, JobType, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
const CATEGORIES = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Education', 'Engineering', 'Design', 'Sales'];

const COMPANIES = [
  { name: 'Pathao Ltd', logo: 'https:// Pathao.com/logo.png' },
  { name: 'bKash Limited', logo: 'https://bKash.com/logo.png' },
  { name: 'Daraz Bangladesh', logo: 'https://daraz.com/logo.png' },
  { name: 'Grameenphone', logo: 'https://gp.com/logo.png' },
  { name: 'BRAC', logo: 'https://brac.net/logo.png' },
  { name: 'Shohoz', logo: 'https://shohoz.com/logo.png' },
  { name: 'Chaldal', logo: 'https://chaldal.com/logo.png' },
  { name: 'ShajGoj', logo: 'https://shajgoj.com/logo.png' },
];

const JOB_TYPES: JobType[] = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'];

const JOB_TITLES = {
  'Technology': [
    'Senior React Developer', 'Backend Engineer (Node.js)', 'Full Stack Developer',
    'DevOps Engineer', 'Data Engineer', 'Mobile App Developer (Flutter)',
    'Python Developer', 'UI/UX Designer', 'QA Engineer', 'Software Architect'
  ],
  'Finance': [
    'Financial Analyst', 'Accountant', 'Finance Manager', 'Investment Analyst',
    'Tax Specialist', 'Budget Analyst', 'Risk Analyst', 'Auditor'
  ],
  'Marketing': [
    'Digital Marketing Manager', 'Content Strategist', 'SEO Specialist',
    'Social Media Manager', 'Brand Manager', 'Marketing Analyst', 'PPC Specialist'
  ],
  'Healthcare': [
    'Medical Officer', 'Nurse', 'Pharmacist', 'Lab Technician',
    'Healthcare Administrator', 'Physical Therapist', 'Radiologist'
  ],
  'Education': [
    'Teacher', 'Tutor', 'Education Coordinator', 'Curriculum Developer',
    'Training Specialist', 'Instructional Designer', 'Professor'
  ],
  'Engineering': [
    'Civil Engineer', 'Electrical Engineer', 'Mechanical Engineer',
    'Industrial Engineer', 'Project Engineer', 'Structural Engineer'
  ],
  'Design': [
    'Graphic Designer', 'Motion Designer', 'Product Designer',
    'Visual Designer', 'Brand Designer', 'UI Designer', 'UX Researcher'
  ],
  'Sales': [
    'Sales Executive', 'Business Development Manager', 'Account Manager',
    'Sales Representative', 'Channel Manager', 'Territory Manager'
  ]
};

const JOB_DESCRIPTIONS = {
  'Technology': `We are looking for an experienced developer to join our dynamic team. You will be responsible for building and maintaining scalable web applications, collaborating with cross-functional teams, and mentoring junior developers.

Key responsibilities include writing clean, maintainable code, participating in code reviews, and ensuring best practices in software development. You should have strong problem-solving skills and the ability to work in a fast-paced environment.`,
  'Finance': `We are seeking a detail-oriented Finance Professional to join our team. You will be responsible for financial planning, analysis, and reporting to support business decisions.

The ideal candidate should have strong analytical skills, attention to detail, and the ability to work with complex financial data. Experience with financial modeling and forecasting is a plus.`,
  'Marketing': `Join our marketing team to drive brand awareness and lead generation. You will develop and execute marketing strategies across digital channels.

We need someone creative with a data-driven approach to marketing. Experience in SEO, content marketing, and social media management is essential.`,
  'Healthcare': `We are looking for compassionate healthcare professionals to provide quality patient care. The role involves diagnosing patients, developing treatment plans, and coordinating with other healthcare providers.

Strong communication skills and a commitment to patient well-being are essential for this role.`,
  'Education': `Join our education team to shape the future of learning. You will create engaging educational content, deliver lessons, and assess student progress.

The ideal candidate should be passionate about teaching and have excellent communication skills. Experience with curriculum development is a plus.`,
  'Engineering': `We are seeking an experienced Engineer to join our projects team. You will be responsible for designing, developing, and maintaining engineering solutions.

Strong technical skills and experience with engineering software are required. Project management experience is a plus.`,
  'Design': `Join our creative team to build beautiful user experiences. You will work on product design, branding, and visual communications.

We need a creative designer with a strong portfolio and proficiency in design tools. Experience with user research is a plus.`,
  'Sales': `Drive revenue growth by identifying and acquiring new customers. You will develop sales strategies, build relationships, and meet targets.

The ideal candidate should have proven sales experience, excellent communication skills, and a results-driven approach.`
};

const REQUIREMENTS = {
  'Technology': [
    'Bachelor\'s degree in Computer Science or related field',
    '3+ years of professional development experience',
    'Strong proficiency in React, Node.js, or Python',
    'Experience with cloud platforms (AWS, GCP, or Azure)',
    'Excellent problem-solving and communication skills'
  ],
  'Finance': [
    'Bachelor\'s degree in Finance, Accounting, or Economics',
    'Professional certification (CA, CMA, or CPA) preferred',
    'Strong analytical and Excel skills',
    'Experience with financial modeling and forecasting',
    'Attention to detail and accuracy'
  ],
  'Marketing': [
    'Bachelor\'s degree in Marketing or Communications',
    '3+ years of digital marketing experience',
    'Knowledge of SEO, SEM, and social media platforms',
    'Experience with marketing analytics tools',
    'Creative thinking and strong writing skills'
  ],
  'Healthcare': [
    'MBBS/MD or relevant medical degree',
    'Valid medical license and registration',
    'Minimum 2 years of clinical experience',
    'Excellent patient care and communication skills',
    'Ability to work in a team environment'
  ],
  'Education': [
    'Bachelor\'s or Master\'s in Education or relevant subject',
    'Teaching certification preferred',
    'Strong communication and presentation skills',
    'Experience with online learning platforms',
    'Patience and adaptability'
  ],
  'Engineering': [
    'Bachelor\'s degree in Engineering (Civil/Electrical/Mechanical)',
    'Professional engineering license preferred',
    '3+ years of relevant experience',
    'Proficiency in engineering software (AutoCAD, MATLAB)',
    'Project management skills'
  ],
  'Design': [
    'Bachelor\'s degree in Design or related field',
    'Strong portfolio showcasing design work',
    'Proficiency in Figma, Adobe Creative Suite',
    'Understanding of UI/UX principles',
    'Ability to work on multiple projects'
  ],
  'Sales': [
    'Bachelor\'s degree in Business or related field',
    '3+ years of B2B sales experience',
    'Proven track record of meeting targets',
    'Excellent negotiation and presentation skills',
    'CRM and sales tool experience'
  ]
};

const RESPONSIBILITIES = {
  'Technology': [
    'Design and develop scalable web applications',
    'Write clean, efficient, and well-documented code',
    'Collaborate with cross-functional teams',
    'Participate in code reviews and mentor junior developers',
    'Stay updated with emerging technologies'
  ],
  'Finance': [
    'Prepare financial statements and reports',
    'Analyze financial data and provide insights',
    'Manage budgets and forecast financial performance',
    'Ensure compliance with financial regulations',
    'Collaborate with auditors and tax advisors'
  ],
  'Marketing': [
    'Develop and execute marketing campaigns',
    'Manage social media and content strategy',
    'Analyze campaign performance and optimize',
    'Collaborate with sales team for lead generation',
    'Manage brand communications'
  ],
  'Healthcare': [
    'Diagnose and treat patients appropriately',
    'Maintain accurate medical records',
    'Coordinate with other healthcare professionals',
    'Stay updated with medical advancements',
    'Follow healthcare protocols and standards'
  ],
  'Education': [
    'Create and deliver engaging lessons',
    'Assess and evaluate student progress',
    'Develop curriculum and learning materials',
    'Provide feedback and support to students',
    'Collaborate with other educators'
  ],
  'Engineering': [
    'Design and develop engineering solutions',
    'Prepare technical specifications and drawings',
    'Conduct site inspections and quality checks',
    'Manage project timelines and budgets',
    'Ensure compliance with safety standards'
  ],
  'Design': [
    'Create visual designs for products and campaigns',
    'Develop brand identity and guidelines',
    'Conduct user research and testing',
    'Collaborate with developers and product teams',
    'Present design concepts to stakeholders'
  ],
  'Sales': [
    'Identify and prospect new customers',
    'Build and maintain client relationships',
    'Meet sales targets and objectives',
    'Prepare sales proposals and presentations',
    'Use CRM to track leads and opportunities'
  ]
};

const SKILLS = {
  'Technology': ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Java', 'PHP', 'Vue.js', 'Go', 'GraphQL', 'Kubernetes', 'Redis'],
  'Finance': ['Financial Analysis', 'Excel', 'QuickBooks', 'SAP', 'Budgeting', 'Forecasting', 'Tax Planning', 'Auditing', 'Financial Modeling', 'Tally'],
  'Marketing': ['SEO', 'SEM', 'Content Marketing', 'Social Media', 'Google Analytics', 'Email Marketing', 'Copywriting', 'HubSpot', 'WordPress', 'PPC'],
  'Healthcare': ['Patient Care', 'Clinical Diagnosis', 'EMR', 'Medical Writing', 'First Aid', 'CPR', 'Healthcare Management', 'Pharmacology'],
  'Education': ['Curriculum Development', 'Lesson Planning', 'Online Teaching', 'Student Assessment', 'Classroom Management', 'E-Learning', 'MS Office'],
  'Engineering': ['AutoCAD', 'MATLAB', 'SolidWorks', 'Project Management', 'Structural Analysis', 'Electrical Design', 'Mechanical Design', 'BIM'],
  'Design': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Sketch', 'InVision', 'Prototyping', 'User Research', 'Wireframing'],
  'Sales': ['B2B Sales', 'Negotiation', 'CRM', 'Lead Generation', 'Cold Calling', 'Presentation', 'Account Management', 'Salesforce', 'HubSpot']
};

const HASH = async (pass: string) => bcrypt.hash(pass, 12);

async function main() {
  await prisma.application.deleteMany();
  await prisma.review.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@hireiq.com',
      password: await HASH('Admin@123'),
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin created');

  const employers = await Promise.all(
    Array.from({ length: 5 }, async (_, i) => prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: i === 0 ? 'employer@hireiq.com' : faker.internet.email(),
        password: await HASH('Employer@123'),
        role: Role.EMPLOYER,
        phone: `+880${faker.string.numeric(10)}`,
        location: faker.helpers.arrayElement(DISTRICTS),
        isActive: true,
      },
    }))
  );
  console.log('✅ Employers created');

  const jobseekers = await Promise.all(
    Array.from({ length: 15 }, async (_, i) => prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: i === 0 ? 'user@hireiq.com' : faker.internet.email(),
        password: await HASH('User@123'),
        role: Role.JOBSEEKER,
        phone: `+880${faker.string.numeric(10)}`,
        location: faker.helpers.arrayElement(DISTRICTS),
        bio: faker.lorem.sentences(2),
        skills: faker.helpers.arrayElements(
          ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Java', 'PHP'],
          faker.number.int({ min: 3, max: 6 })
        ),
        isActive: true,
      },
    }))
  );
  console.log('✅ Jobseekers created');

  const jobs = await Promise.all(
    Array.from({ length: 40 }, async (_, i) => {
      const employer = faker.helpers.arrayElement(employers);
      const category = faker.helpers.arrayElement(CATEGORIES);
      const company = faker.helpers.arrayElement(COMPANIES);
      const titles = JOB_TITLES[category as keyof typeof JOB_TITLES];
      const title = titles[i % titles.length];
      const salaryMin = faker.number.int({ min: 25000, max: 150000 });
      const salaryMax = salaryMin + faker.number.int({ min: 20000, max: 100000 });

      return prisma.job.create({
        data: {
          title,
          description: JOB_DESCRIPTIONS[category as keyof typeof JOB_DESCRIPTIONS],
          requirements: REQUIREMENTS[category as keyof typeof REQUIREMENTS],
          responsibilities: RESPONSIBILITIES[category as keyof typeof RESPONSIBILITIES],
          skills: faker.helpers.arrayElements(SKILLS[category as keyof typeof SKILLS], faker.number.int({ min: 3, max: 5 })),
          type: faker.helpers.arrayElement(JOB_TYPES),
          category,
          location: `${faker.helpers.arrayElement(DISTRICTS)}, Bangladesh`,
          district: faker.helpers.arrayElement(DISTRICTS),
          salary: `৳ ${salaryMin.toLocaleString()} - ৳ ${salaryMax.toLocaleString()}`,
          salaryMin,
          salaryMax,
          deadline: faker.date.future({ years: 0.5 }),
          status: JobStatus.OPEN,
          isFeatured: i < 8,
          companyName: company.name,
          employerId: employer.id,
          aiTags: [],
        },
      });
    })
  );
  console.log(`✅ ${jobs.length} Jobs created with real content`);

  await Promise.all(
    Array.from({ length: 30 }, async () => {
      const jobseeker = faker.helpers.arrayElement(jobseekers);
      const job = faker.helpers.arrayElement(jobs);
      return prisma.application.create({
        data: {
          jobId: job.id,
          userId: jobseeker.id,
          coverLetter: faker.lorem.paragraph(),
          resumeUrl: faker.internet.url(),
          status: faker.helpers.arrayElement(['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED']),
        },
      }).catch(() => null);
    })
  );
  console.log('✅ Applications created');

  const blogTopics = [
    { title: 'Top 10 In-Demand Tech Skills in Bangladesh 2025', category: 'Career Tips', content: 'The tech industry in Bangladesh is growing rapidly, with increasing demand for skilled professionals in areas like React, Node.js, Python, and cloud technologies. Companies are actively seeking talent with modern tech skills and the ability to adapt to emerging technologies. This article explores the most sought-after skills and how you can position yourself for success in the competitive job market.' },
    { title: 'How to Write a CV That Gets You Hired in Dhaka', category: 'CV Writing', content: 'Your CV is your first impression to potential employers. In Dhaka\'s competitive job market, a well-crafted CV can make the difference between getting an interview or being overlooked. Learn how to structure your CV, highlight your achievements, and make your application stand out from the crowd. We provide tips from top HR professionals and successful job seekers.' },
    { title: 'Salary Guide: What to Expect in Bangladesh IT Sector', category: 'Salary', content: 'The IT sector in Bangladesh offers competitive salaries with opportunities for growth. This comprehensive guide breaks down salary ranges for various roles including developer, designer, QA, and management positions. Learn what factors affect your salary and how to negotiate effectively with employers.' },
    { title: 'Remote Work Opportunities for Bangladeshi Professionals', category: 'Remote Work', content: 'Remote work has opened new possibilities for Bangladeshi professionals to work with global companies. Discover the best platforms for finding remote jobs, tips for staying productive while working from home, and how to manage work-life balance in a remote setting.' },
    { title: 'Interview Tips for Top Companies in Bangladesh', category: 'Interview', content: 'Ace your next interview with these proven strategies. We cover common interview questions, how to prepare for technical assessments, and what top companies like Pathao, bKash, and Grameenphone look for in candidates. Learn from experts and successful applicants.' },
  ];

  await Promise.all(
    blogTopics.map(async (topic, i) => prisma.blog.create({
      data: {
        title: topic.title,
        slug: topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        content: topic.content + ' ' + faker.lorem.paragraphs(5),
        coverImage: `https://picsum.photos/seed/${i + 10}/800/400`,
        category: topic.category,
        tags: [topic.category, 'Bangladesh', 'Career'],
        authorId: admin.id,
        isPublished: true,
      },
    }))
  );
  console.log('✅ Blogs created with real content');

  console.log('\n🎉 Seed complete!');
  console.log('📧 Demo credentials:');
  console.log('   Admin:     admin@hireiq.com / Admin@123');
  console.log('   Employer:  employer@hireiq.com / Employer@123');
  console.log('   Jobseeker: user@hireiq.com / User@123');
  console.log('\n📖 Swagger docs: http://localhost:5000/api-docs');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });