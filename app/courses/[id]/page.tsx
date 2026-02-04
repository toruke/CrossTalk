'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { getDisplayName } from '@/src/lib/displayName';
import { motion } from 'motion/react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { Separator } from '@/src/components/ui/separator';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Play, Trophy, Lock } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  order: number;
  quiz: { id: number; title: string; passingScore: number } | null;
}

interface CourseDetail {
  id: number;
  language: string;
  level: string;
  description: string | null;
  teacher: { id: number; firstName: string; lastName: string; email: string };
  lessons: Lesson[];
  enrollments: { userId: number }[];
}

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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { prismaUser, isProf, loading: userLoading } = usePrismaUser();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const courseId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await fetch(`${config.apiUrl}/courses/${courseId}`);
        if (!courseRes.ok) throw new Error('Cours introuvable');
        const courseData = await courseRes.json();
        setCourse(courseData);

        if (prismaUser) {
          const progressRes = await fetch(`${config.apiUrl}/courses/${courseId}/progress/${prismaUser.id}`);
          if (progressRes.ok) {
            setProgress(await progressRes.json());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) fetchData();
  }, [courseId, prismaUser, userLoading]);

  const isEnrolled = course?.enrollments.some(e => e.userId === prismaUser?.id);
  const isOwner = course?.teacher.id === prismaUser?.id;

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

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />
        <div className="pt-32 text-center">
          <p className="text-gray-500">Cours introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => router.push(isProf ? '/my-courses' : '/courses')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {/* Course header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="outline" className="mb-3 text-xs border-[#1E7F88]/20 text-[#1E7F88] bg-[#1E7F88]/5">
                {course.language} - {course.level}
              </Badge>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.language} {course.level}
              </h1>
              <p className="text-gray-500 mt-1">
                par {getDisplayName(course.teacher)}
              </p>
              {course.description && (
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{course.description}</p>
              )}
            </div>
            {isOwner && (
              <Button
                onClick={() => router.push(`/my-courses/${course.id}/edit`)}
                variant="outline"
                className="border-[#1E7F88] text-[#1E7F88]"
              >
                Gerer le cours
              </Button>
            )}
          </div>

          {/* Progress bar */}
          {progress && progress.totalLessons > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm font-bold text-[#1E7F88]">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {progress.completedLessons}/{progress.totalLessons} lecons terminees
              </p>
            </div>
          )}
        </div>

        {/* Lessons list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1E7F88]" />
            Lecons ({course.lessons.length})
          </h2>

          {course.lessons.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune lecon pour le moment</p>
              {isOwner && (
                <Button
                  onClick={() => router.push(`/my-courses/${course.id}/edit`)}
                  className="mt-4 bg-[#1E7F88] hover:bg-[#176570] text-white"
                >
                  Ajouter des lecons
                </Button>
              )}
            </div>
          )}

          {course.lessons.map((lesson, index) => {
            const progressLesson = progress?.lessons.find(l => l.id === lesson.id);
            const isCompleted = progressLesson?.completed || false;
            const canAccess = isEnrolled || isOwner;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`border-gray-100 transition-all duration-200 ${
                    canAccess ? 'hover:border-gray-200 hover:shadow-md cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => canAccess && router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-600'
                        : canAccess
                          ? 'bg-[#1E7F88]/10 text-[#1E7F88]'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : canAccess ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Lecon {lesson.order + 1}: {lesson.title}
                      </p>
                      {lesson.quiz && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] border-[#F1843F]/20 text-[#F1843F]">
                            QCM
                          </Badge>
                          {progressLesson?.quizPassed !== null && (
                            <span className={`text-[10px] font-medium ${
                              progressLesson?.quizPassed ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                              {progressLesson?.quizScore}%
                              {progressLesson?.quizPassed && <Trophy className="w-3 h-3 inline ml-0.5" />}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {canAccess && (
                      <ArrowLeft className="w-4 h-4 text-gray-300 rotate-180" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Enroll CTA */}
        {!isEnrolled && !isOwner && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inscrivez-vous pour acceder au contenu</h3>
            <p className="text-sm text-gray-500 mb-4">Vous devez etre inscrit a ce cours pour voir les lecons</p>
            <Button
              onClick={async () => {
                if (!prismaUser) return;
                const res = await fetch(`${config.apiUrl}/enrollments`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: prismaUser.id, courseId: course.id }),
                });
                if (res.ok) window.location.reload();
              }}
              className="bg-[#1E7F88] hover:bg-[#176570] text-white px-8"
            >
              S'inscrire au cours
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
