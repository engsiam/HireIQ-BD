import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HireIQ BD API',
      version: '1.0.0',
      description: `
## HireIQ BD — AI-Powered Job Portal API

### Authentication
Use the \`/auth/login\` endpoint to get a JWT token, then click **Authorize** and enter: \`Bearer <your_token>\`

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hireiq.com | Admin@123 |
| Employer | employer@hireiq.com | Employer@123 |
| Jobseeker | user@hireiq.com | User@123
      `,
      contact: {
        name: 'HireIQ BD Team',
        email: 'api@hireiq.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
      {
        url: 'https://your-production-url.com/api/v1',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Rahul Ahmed' },
            email: { type: 'string', example: 'rahul@example.com' },
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYER', 'JOBSEEKER'] },
            avatar: { type: 'string', nullable: true },
            skills: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Senior React Developer' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'] },
            category: { type: 'string', example: 'Technology' },
            district: { type: 'string', example: 'Dhaka' },
            salary: { type: 'string', example: '80,000-120,000 BDT' },
            salaryMin: { type: 'number', example: 80000 },
            salaryMax: { type: 'number', example: 120000 },
            status: { type: 'string', enum: ['OPEN', 'CLOSED', 'DRAFT'] },
            isFeatured: { type: 'boolean' },
            companyName: { type: 'string', example: 'Pathao Ltd' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            jobId: { type: 'string' },
            userId: { type: 'string' },
            coverLetter: { type: 'string' },
            resumeUrl: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED'] },
            aiScore: { type: 'number', nullable: true },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Unauthorized' },
            statusCode: { type: 'number', example: 401 },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Jobs', description: 'Job listing endpoints' },
      { name: 'Applications', description: 'Job application endpoints' },
      { name: 'Reviews', description: 'Job review endpoints' },
      { name: 'Blogs', description: 'Blog management endpoints' },
      { name: 'Contact', description: 'Contact form endpoints' },
      { name: 'Stats', description: 'Admin statistics endpoints' },
      { name: 'AI', description: 'AI feature endpoints' },
    ],
  },
  apis: ['./src/app/modules/**/*.route.ts', './src/app/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { background-color: #EB4C4C; }
      .swagger-ui .topbar-wrapper img { content: url(''); }
      .swagger-ui .topbar-wrapper::after { content: 'HireIQ BD API'; color: white; font-size: 20px; font-weight: bold; }
      .swagger-ui .info .title { font-size: 32px; }
    `,
    customSiteTitle: 'HireIQ BD API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};