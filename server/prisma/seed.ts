import { PrismaClient, Role, JobType, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
const CATEGORIES = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Education', 'Engineering', 'Design', 'Sales'];
const COMPANIES = ['Pathao Ltd', 'bKash Limited', 'Daraz Bangladesh', 'Grameenphone', 'BRAC', 'Shohoz', 'Chaldal', 'ShajGoj', 'Shajgoj', 'Kaan Pete Roi', 'Shikho', 'Maya', 'Truck Lagbe'];
const JOB_TYPES: JobType[] = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'];

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
      const salaryMin = faker.number.int({ min: 25000, max: 100000 });
      const salaryMax = salaryMin + faker.number.int({ min: 20000, max: 80000 });

      return prisma.job.create({
        data: {
          title: `${faker.helpers.arrayElement(['Senior', 'Junior', 'Mid-level', 'Lead'])} ${faker.helpers.arrayElement(['React Developer', 'Node.js Engineer', 'Product Manager', 'Data Analyst', 'DevOps Engineer', 'UI/UX Designer', 'Marketing Manager', 'Sales Executive', 'Accountant', 'HR Manager'])}`,
          description: faker.lorem.paragraphs(3),
          requirements: Array.from({ length: 4 }, () => faker.lorem.sentence()),
          responsibilities: Array.from({ length: 4 }, () => faker.lorem.sentence()),
          skills: faker.helpers.arrayElements(['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'Java', 'PHP', 'Vue.js'], 4),
          type: faker.helpers.arrayElement(JOB_TYPES),
          category,
          location: `${faker.helpers.arrayElement(DISTRICTS)}, Bangladesh`,
          district: faker.helpers.arrayElement(DISTRICTS),
          salary: `${salaryMin.toLocaleString()}-${salaryMax.toLocaleString()} BDT`,
          salaryMin,
          salaryMax,
          deadline: faker.date.future({ years: 0.5 }),
          status: JobStatus.OPEN,
          isFeatured: i < 8,
          companyName: faker.helpers.arrayElement(COMPANIES),
          employerId: employer.id,
          aiTags: [],
        },
      });
    })
  );
  console.log(`✅ ${jobs.length} Jobs created`);

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
    { title: 'Top 10 In-Demand Tech Skills in Bangladesh 2025', category: 'Career Tips' },
    { title: 'How to Write a CV That Gets You Hired in Dhaka', category: 'CV Writing' },
    { title: 'Salary Guide: What to Expect in Bangladesh IT Sector', category: 'Salary' },
    { title: 'Remote Work Opportunities for Bangladeshi Professionals', category: 'Remote Work' },
    { title: 'Interview Tips for Top Companies in Bangladesh', category: 'Interview' },
  ];

  await Promise.all(
    blogTopics.map(async (topic, i) => prisma.blog.create({
      data: {
        title: topic.title,
        slug: topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        content: faker.lorem.paragraphs(8),
        coverImage: `https://picsum.photos/seed/${i + 10}/800/400`,
        category: topic.category,
        tags: [topic.category, 'Bangladesh', 'Career'],
        authorId: admin.id,
        isPublished: true,
      },
    }))
  );
  console.log('✅ Blogs created');

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