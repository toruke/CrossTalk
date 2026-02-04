'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { motion } from 'motion/react';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { Separator } from '@/src/components/ui/separator';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Trophy,
  XCircle,
  TrendingUp,
} from 'lucide-react';

interface ProgressData {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lessons: {
    id: number;
    title: string;
    order: number;
    completed: boolean;
    quizScore: number | null;
    quizPassed: boolean | null;
  }[];
}

interface CourseInfo {
  id: number;
  language: string;
  level: string;
  description: string | null;
}

export default function CourseResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { prismaUser, loading: userLoading } = usePrismaUser();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const courseId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!prismaUser) { setLoading(false); return; }
      try {
        const [courseRes, progressRes] = await Promise.all([
          fetch(`${config.apiUrl}/courses/${courseId}`),
          fetch(`${config.apiUrl}/courses/${courseId}/progress/${prismaUser.id}`),
        ]);

        if (courseRes.ok) setCourse(await courseRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) fetchData();
  }, [courseId, prismaUser, userLoading]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />
        <div className="pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!progress || !course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />
        <div className="pt-32 text-center">
          <p className="text-gray-500">Aucune progression trouvee</p>
        </div>
      </div>
    );
  }

  const isComplete = progress.percentage === 100;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => router.push(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au cours
        </button>

        {/* Header with overall progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-[#1E7F88]" />
            <h1 className="text-xl font-bold text-gray-900">Ma progression</h1>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {course.language} - {course.level}
          </p>

          {/* Score circle */}
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={isComplete ? '#059669' : '#1E7F88'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${progress.percentage * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{progress.percentage}%</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lecons terminees</span>
                <span className="text-sm font-semibold text-gray-900">
                  {progress.completedLessons} / {progress.totalLessons}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              {isComplete && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Cours termine !</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lessons detail */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E7F88]" />
          Detail par lecon
        </h2>

        <div className="space-y-3">
          {progress.lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer transition-all"
                onClick={() => router.push(`/courses/${courseId}/lessons/${lesson.id}`)}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      lesson.completed
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Lecon {lesson.order + 1}: {lesson.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          lesson.completed
                            ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                            : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        {lesson.completed ? 'Terminee' : 'En cours'}
                      </Badge>

                      {lesson.quizScore !== null && (
                        <div className="flex items-center gap-1">
                          {lesson.quizPassed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          <span
                            className={`text-[10px] font-medium ${
                              lesson.quizPassed ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            QCM: {lesson.quizScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
