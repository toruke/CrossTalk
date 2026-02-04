import { Request, Response, NextFunction } from 'express';

// Wrapper pour catch les erreurs async automatiquement
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware global de gestion d'erreurs
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur:', err.message);
  res.status(500).json({ error: err.message || 'Erreur serveur' });
};
