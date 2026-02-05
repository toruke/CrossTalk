import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// GET /courses - Liste tous les cours (catalogue)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { teacher: true }
  });
  res.json(courses);
}));

// POST /courses - Créer un cours (PROF ou ADMIN)
router.post('/', requireAuth, requireRole('PROF', 'ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const { language, level, teacherId } = req.body;
  
  const course = await prisma.course.create({
    data: { language, level, teacherId: Number(teacherId) }
  });
  
  res.json(course);
}));

// GET /my-courses/:userId - Cours auxquels un élève est inscrit
router.get('/my/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: Number(userId) },
    include: { course: { include: { teacher: true } } }
  });
  
  const myCourses = enrollments.map((e: typeof enrollments[number]) => e.course);
  res.json(myCourses);
}));

// GET /teacher-courses/:teacherId - Cours d'un prof
router.get('/teacher/:teacherId', asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  
  const courses = await prisma.course.findMany({
    where: { teacherId: Number(teacherId) },
    include: {
      enrollments: {
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
      }
    }
  });
  
  res.json(courses);
}));

// PUT /courses/:id - Update course metadata (PROF ou ADMIN)
router.put('/:id', requireAuth, requireRole('PROF', 'ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);
  const { description, language, level } = req.body;

  const data: Record<string, unknown> = {};
  if (description !== undefined) data.description = description;
  if (language !== undefined) data.language = language;
  if (level !== undefined) data.level = level;

  const course = await prisma.course.update({
    where: { id: courseId },
    data,
  });

  res.json(course);
}));

// GET /courses/:id - Detail d'un cours avec lecons
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);
  if (isNaN(courseId)) {
    res.status(400).json({ error: 'ID invalide' });
    return;
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { select: { id: true, firstName: true, lastName: true, email: true } },
      lessons: {
        orderBy: { order: 'asc' },
        include: {
          quiz: { select: { id: true, title: true, passingScore: true } },
        },
      },
      enrollments: { select: { userId: true } },
    },
  });

  if (!course) {
    res.status(404).json({ error: 'Cours introuvable' });
    return;
  }

  res.json(course);
}));

// GET /courses/:id/progress/:userId - Progression d'un eleve
router.get('/:id/progress/:userId', asyncHandler(async (req: Request, res: Response) => {
  const courseId = Number(req.params.id);
  const userId = Number(req.params.userId);

  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      quiz: {
        include: {
          attempts: {
            where: { userId },
            orderBy: { completedAt: 'desc' },
            take: 1,
          },
        },
      },
      progress: { where: { userId } },
    },
  });

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l: typeof lessons[number]) => l.progress.length > 0 && l.progress[0].completed).length;

  res.json({
    totalLessons,
    completedLessons,
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    lessons: lessons.map((l: typeof lessons[number]) => ({
      id: l.id,
      title: l.title,
      order: l.order,
      completed: l.progress.length > 0 && l.progress[0].completed,
      quizScore: l.quiz?.attempts[0]?.score ?? null,
      quizPassed: l.quiz ? (l.quiz.attempts[0]?.score ?? 0) >= l.quiz.passingScore : null,
    })),
  });
}));

export default router;
