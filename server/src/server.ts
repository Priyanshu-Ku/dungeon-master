import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Connecting to database via Driver Adapter...');
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set in environment variables');
  process.exit(1);
}

// 1. Create a pg Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors());   // Enable CORS for frontend requests
app.use(express.json());

// Routes
app.get('/health', async (req, res) => {
  try {
    // Basic DB check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database check failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Start Server
const server = app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

// Graceful Shutdown
const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  server.close();
  await prisma.$disconnect();
  await pool.end();
  console.log('Connections closed. Goodbye!');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
