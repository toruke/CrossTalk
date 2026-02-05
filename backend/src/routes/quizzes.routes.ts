import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middlewares/errorHandler';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// GET /quizzes/:id - Get quiz with questions and options
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      lesson: { select: { id: true, title: true, courseId: true } },
      questions: {
        orderBy: { order: 'asc' },
        include: {
          options: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!quiz) {
    res.status(404).json({ error: 'Quiz introuvable' });
    return;
  }

  res.json(quiz);
}));

// POST /quizzes - Create a quiz for a lesson (PROF ou ADMIN)
router.post('/', requireAuth, requireRole('PROF', 'ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const { lessonId, title, passingScore, questions } = req.body;

  const quiz = await prisma.quiz.create({
    data: {
      lessonId: Number(lessonId),
      title,
      passingScore: passingScore ?? 70,
      questions: {
        create: (questions || []).map((q: { text: string; order?: number; options: { text: string; isCorrect: boolean; order?: number }[] }, qi: number) => ({
          text: q.text,
          order: q.order ?? qi,
          options: {
            create: (q.options || []).map((o: { text: string; isCorrect: boolean; order?: number }, oi: number) => ({
              text: o.text,
              isCorrect: o.isCorrect || false,
              order: o.order ?? oi,
            })),
          },
        })),
      },
    },
    include: {
      questions: {
        include: { options: true },
      },
    },
  });

  res.json(quiz);
}));

// PUT /quizzes/:id - Update quiz metadata (PROF ou ADMIN)
router.put('/:id', requireAuth, requireRole('PROF', 'ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  const { title, passingScore } = req.body;

  const quiz = await prisma.quiz.update({
    where: { id: Number(req.params.id) },
    data: { title, passingScore },
  });

  res.json(quiz);
}));

// DELETE /quizzes/:id (PROF ou ADMIN)
router.delete('/:id', requireAuth, requireRole('PROF', 'ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  await prisma.quiz.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
}));

// POST /quizzes/:id/submit - Submit quiz answers
router.post('/:id/submit', asyncHandler(async (req: Request, res: Response) => {
  const quizId = Number(req.params.id);
  const { userId, answers } = req.body;
  // answers: [{ questionId: number, optionId: number }]

  // Get quiz with correct answers
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: { where: { isCorrect: true } },
        },
      },
    },
  });

  if (!quiz) {
    res.status(404).json({ error: 'Quiz introuvable' });
    return;
  }

  // Calculate score
  const totalQuestions = quiz.questions.length;
  let correctCount = 0;

  for (const answer of answers) {
    const question = quiz.questions.find((q: { id: number }) => q.id === answer.questionId);
    if (question) {
      const correctOptionId = question.options[0]?.id;
      if (correctOptionId === answer.optionId) {
        correctCount++;
      }
    }
  }

  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Save attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: Number(userId),
      quizId,
      score,
      answers: {
        create: answers.map((a: { questionId: number; optionId: number }) => ({
          questionId: a.questionId,
          optionId: a.optionId,
        })),
      },
    },
    include: {
      answers: {
        include: {
          question: true,
          option: true,
        },
      },
    },
  });

  res.json({
    attemptId: attempt.id,
    score,
    passed: score >= quiz.passingScore,
    totalQuestions,
    correctCount,
  });
}));

// GET /quizzes/:id/attempts/:userId - Get user's attempts for a quiz
router.get('/:id/attempts/:userId', asyncHandler(async (req: Request, res: Response) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      quizId: Number(req.params.id),
      userId: Number(req.params.userId),
    },
    orderBy: { completedAt: 'desc' },
  });

  res.json(attempts);
}));

export default router;
