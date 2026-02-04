'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
} from 'lucide-react';

interface LessonData {
  id: number;
  title: string;
  order: number;
  courseId: number;
  course: { id: number; language: string; level: string; teacherId: number };
  quiz: { id: number; title: string; passingScore: number } | null;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { prismaUser, isProf, loading: userLoading } = usePrismaUser();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);

  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/lessons/${lessonId}`);
        if (!res.ok) throw new Error('Lecon introuvable');
        const data = await res.json();
        setLesson(data);

        // If lesson has a quiz, redirect directly to it
        if (data.quiz) {
          router.replace(`/courses/${courseId}/quiz/${data.quiz.id}`);
          return;
        }

        // Check progress
        if (prismaUser) {
          const progressRes = await fetch(
            `${config.apiUrl}/courses/${data.courseId}/progress/${prismaUser.id}`
          );
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            const lessonProgress = progressData.lessons?.find(
              (l: { id: number }) => l.id === data.id
            );
            if (lessonProgress?.completed) {
              setCompleted(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) fetchLesson();
  }, [lessonId, courseId, prismaUser, userLoading, router]);

  const markAsCompleted = async () => {
    if (!prismaUser || marking) return;
    setMarking(true);
    try {
      const res = await fetch(`${config.apiUrl}/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: prismaUser.id }),
      });
      if (res.ok) setCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

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

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />
        <div className="pt-32 text-center">
          <p className="text-gray-500">Lecon introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back button */}
        <button
          onClick={() => router.push(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au cours
        </button>

        {/* Lesson header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-8 mb-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs border-[#1E7F88]/20 text-[#1E7F88] bg-[#1E7F88]/5">
                  {lesson.course.language} - {lesson.course.level}
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                  Lecon {lesson.order + 1}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>

            {completed && (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Terminee</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Mark as completed */}
          {!completed && !isProf && (
            <Button
              onClick={markAsCompleted}
              disabled={marking}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {marking ? 'En cours...' : 'Marquer comme terminee'}
            </Button>
          )}

          {/* Quiz button */}
          {lesson.quiz && (
            <Button
              onClick={() =>
                router.push(`/courses/${courseId}/quiz/${lesson.quiz!.id}`)
              }
              className="bg-[#F1843F] hover:bg-[#d9722f] text-white flex-1 sm:flex-none"
            >
              <FileQuestion className="w-4 h-4 mr-2" />
              Passer le QCM : {lesson.quiz.title}
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
