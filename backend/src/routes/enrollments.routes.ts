import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';

const router = Router();

// POST /enrollments - Inscrire un élève à un cours
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;
  
  // Vérifier si déjà inscrit
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: Number(userId), courseId: Number(courseId) } }
  });
  
  if (existing) {
    return res.status(400).json({ error: 'Déjà inscrit à ce cours' });
  }
  
  const enrollment = await prisma.enrollment.create({
    data: { userId: Number(userId), courseId: Number(courseId) }
  });
  
  res.json(enrollment);
}));

// DELETE /enrollments/:userId/:courseId - Se désinscrire
router.delete('/:userId/:courseId', asyncHandler(async (req: Request, res: Response) => {
  const { userId, courseId } = req.params;
  
  await prisma.enrollment.delete({
    where: { userId_courseId: { userId: Number(userId), courseId: Number(courseId) } }
  });
  
  res.json({ success: true });
}));

export default router;
