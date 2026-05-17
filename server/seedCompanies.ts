import prisma from './src/prisma/client';

async function main() {
  // Find or create an employer user
  let employer = await prisma.user.findFirst({ where: { role: 'EMPLOYER' } });

  if (!employer) {
    employer = await prisma.user.create({
      data: {
        name: 'Test Employer',
        email: 'employer@test.com',
        role: 'EMPLOYER',
      },
    });
    console.log('Created employer:', employer.email);
  }

  const companies = [
    { name: 'Tech Innovations Ltd', industry: 'Technology', size: '51-200', location: 'Dhaka', district: 'Dhaka', description: 'Leading software company in Bangladesh', website: 'https://techinnovations.com' },
    { name: 'Bangladesh Bank', industry: 'Finance', size: '1000+', location: 'Dhaka', district: 'Dhaka', description: 'Central bank of Bangladesh', website: 'https://bb.org.bd' },
    { name: 'Apollo Hospital', industry: 'Healthcare', size: '201-500', location: 'Dhaka', district: 'Dhaka', description: 'Best healthcare provider', website: 'https://apollohospitals.com' },
    { name: 'BRAC', industry: 'Education', size: '1000+', location: 'Dhaka', district: 'Dhaka', description: 'Largest NGO in the world', website: 'https://brac.net' },
    { name: 'GP', industry: 'Telecommunication', size: '501-1000', location: 'Dhaka', district: 'Dhaka', description: 'Grameenphone - leading telecom', website: 'https://grameenphone.com' },
  ];

  for (const company of companies) {
    await prisma.company.create({
      data: {
        ...company,
        employerId: employer.id,
      },
    });
    console.log('Created company:', company.name);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => process.exit());