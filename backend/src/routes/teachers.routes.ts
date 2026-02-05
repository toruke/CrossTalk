import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// GET /teachers - Tous les profs (Admin uniquement)
router.get('/', requireAuth, requireRole('ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const teachers = await prisma.user.findMany({
    where: { role: 'PROF' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      coursesTaught: {
        select: { id: true, language: true, level: true }
      }
    }
  });
  res.json(teachers);
}));

// GET /my-teachers/:userId - Profs des cours auxquels un élève est inscrit
router.get('/my/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: Number(userId) },
    include: {
      course: {
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              coursesTaught: {
                select: { id: true, language: true, level: true }
              }
            }
          }
        }
      }
    }
  });
  
  // Extraire les profs uniques
  const teachersMap = new Map();
  enrollments.forEach((e: typeof enrollments[number]) => {
    const teacher = e.course.teacher;
    if (!teachersMap.has(teacher.id)) {
      teachersMap.set(teacher.id, teacher);
    }
  });
  
  res.json(Array.from(teachersMap.values()));
}));

// GET /my-students/:teacherId - Élèves d'un prof
router.get('/students/:teacherId', asyncHandler(async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  
  const courses = await prisma.course.findMany({
    where: { teacherId: Number(teacherId) },
    include: {
      enrollments: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, clerkId: true } }
        }
      }
    }
  });
  
  // Extraire les élèves uniques avec leurs cours
  const studentsMap = new Map();
  courses.forEach((c: typeof courses[number]) => {
    c.enrollments.forEach((e: typeof c.enrollments[number]) => {
      if (!studentsMap.has(e.user.id)) {
        studentsMap.set(e.user.id, { ...e.user, courses: [] });
      }
      studentsMap.get(e.user.id).courses.push({
        id: c.id,
        language: c.language,
        level: c.level
      });
    });
  });
  
  res.json(Array.from(studentsMap.values()));
}));

export default router;
