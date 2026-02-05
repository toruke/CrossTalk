import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';

// Étendre le type Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        clerkId: string | null;
        email: string;
        role: Role;
      };
      auth?: {
        userId: string;
      };
    }
  }
}

/**
 * Middleware d'authentification.
 * Vérifie le Bearer Token JWT via Clerk.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token manquant' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // 1. Vérifier le token avec Clerk (Signature cryptographique)
    const client = await clerkClient.verifyToken(token);
    const clerkId = client.sub;

    // 2. Chercher l'utilisateur correspondant dans NOTRE base
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      // Cas rare : User authentifié chez Clerk mais pas encore synchro en DB
      res.status(401).json({ error: 'Utilisateur non trouvé en base' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

/**
 * Middleware d'autorisation par rôle.
 * Doit être utilisé APRÈS `requireAuth`.
 */
export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Accès refusé' });
      return;
    }

    next();
  };
};
