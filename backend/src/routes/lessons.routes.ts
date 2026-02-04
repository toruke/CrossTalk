import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';

const router = Router();

// GET /lessons/:id - Get a lesson with its quiz
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      course: { select: { id: true, language: true, level: true, teacherId: true } },
      quiz: { select: { id: true, title: true, passingScore: true } },
    },
  });

  if (!lesson) {
    res.status(404).json({ error: 'Lecon introuvable' });
    return;
  }

  res.json(lesson);
}));

// POST /lessons - Create a lesson for a course
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { courseId, title, order } = req.body;

  const lesson = await prisma.lesson.create({
    data: {
      courseId: Number(courseId),
      title,
      order: order ?? 0,
    },
  });

  res.json(lesson);
}));

// PUT /lessons/:id - Update a lesson
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { title, order } = req.body;

  const lesson = await prisma.lesson.update({
    where: { id: Number(req.params.id) },
    data: { title, order },
  });

  res.json(lesson);
}));

// DELETE /lessons/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  await prisma.lesson.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));

// POST /lessons/:id/progress - Mark lesson as completed
router.post('/:id/progress', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const lessonId = Number(req.params.id);

  const progress = await prisma.studentProgress.upsert({
    where: { userId_lessonId: { userId: Number(userId), lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId: Number(userId), lessonId, completed: true, completedAt: new Date() },
  });

  res.json(progress);
}));

export default router;
