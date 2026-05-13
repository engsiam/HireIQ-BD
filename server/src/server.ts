import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import env from './config';
import prisma from './prisma/client';

const PORT = parseInt(env.PORT) || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

main();