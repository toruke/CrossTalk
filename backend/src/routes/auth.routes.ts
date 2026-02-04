import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';

const router = Router();

// POST /login - Authentification simple (legacy)
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }
  
  res.status(401).json({ error: 'Email ou mot de passe incorrect' });
}));

export default router;
