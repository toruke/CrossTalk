import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// GET /stats - Dashboard admin (Admin uniquement)
router.get('/', requireAuth, requireRole('ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const [
    totalUsers,
    adminCount,
    profCount,
    eleveCount,
    totalCourses,
    totalEnrollments,
    totalLessons,
    totalQuizAttempts,
    recentEnrollments,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'PROF' } }),
    prisma.user.count({ where: { role: 'ELEVE' } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.lesson.count(),
    prisma.quizAttempt.count(),
    prisma.enrollment.findMany({
      take: 10,
      orderBy: { joinedAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        course: { select: { id: true, language: true, level: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    }),
  ]);

  res.json({
    users: { total: totalUsers, admins: adminCount, profs: profCount, eleves: eleveCount },
    courses: { total: totalCourses },
    enrollments: { total: totalEnrollments },
    lessons: { total: totalLessons },
    quizAttempts: { total: totalQuizAttempts },
    recentEnrollments,
    recentUsers,
  });
}));

export default router;
