import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// NOTE: PrismaClient types are unavailable until `prisma generate` is run.
// Using `any` cast here so tsc passes without generated artifacts.
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const { PrismaClient } = require('@prisma/client') as { PrismaClient: any };

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPrismaClient = (): any => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}