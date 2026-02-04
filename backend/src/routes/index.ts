import { Router } from 'express';

import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import coursesRoutes from './courses.routes';
import enrollmentsRoutes from './enrollments.routes';
import teachersRoutes from './teachers.routes';
import messagesRoutes from './messages.routes';
import lessonsRoutes from './lessons.routes';
import quizzesRoutes from './quizzes.routes';

const router = Router();

// Montage des routes par domaine
router.use('/', authRoutes);              // /login
router.use('/users', usersRoutes);        // /users/sync, /users/me/:clerkId
router.use('/courses', coursesRoutes);    // /courses, /courses/:id, /courses/my/:userId
router.use('/enrollments', enrollmentsRoutes); // /enrollments
router.use('/teachers', teachersRoutes);  // /teachers, /teachers/my/:userId, /teachers/students/:teacherId
router.use('/messages', messagesRoutes);  // /messages
router.use('/lessons', lessonsRoutes);    // /lessons/:id, /lessons/:id/progress
router.use('/quizzes', quizzesRoutes);    // /quizzes/:id, /quizzes/:id/submit

export default router;
