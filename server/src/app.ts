import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/error.middleware';
import routes from './app/routes';
import { setupSwagger } from './swagger';
import env from './config';

const app: Application = express();

app.set('trust proxy', 1);

const getCorsOrigins = (): string[] => {
  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'];
  if (env.CLIENT_URL) {
    return [env.CLIENT_URL, ...defaultOrigins];
  }
  return defaultOrigins;
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const origins = getCorsOrigins();
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

setupSwagger(app);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'HireIQ BD API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    swagger: '/api-docs',
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to HireIQ BD API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
  });
});

app.use('/api/v1', routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(globalErrorHandler);

export default app;