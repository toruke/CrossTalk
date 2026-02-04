import { PrismaClient } from '@prisma/client';

// Instance unique de Prisma (singleton)
export const prisma = new PrismaClient();
