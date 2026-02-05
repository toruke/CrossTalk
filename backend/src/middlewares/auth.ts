import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * Middleware d'authentification.
 * Lit le header `x-clerk-id`, cherche l'utilisateur en DB, attache `req.user`.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.headers['x-clerk-id'] as string | undefined;

    if (!clerkId) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      res.status(401).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
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
