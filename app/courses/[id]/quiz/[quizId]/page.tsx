'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  FileQuestion,
} from 'lucide-react';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: number;
  text: string;
  order: number;
  options: Option[];
}

interface QuizData {
  id: number;
  title: string;
  passingScore: number;
  lesson: { id: number; title: string; courseId: number };
  questions: Question[];
}

interface QuizResult {
  attemptId: number;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { prismaUser, loading: userLoading } = usePrismaUser();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const courseId = params.id as string;
  const quizId = params.quizId as string;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/quizzes/${quizId}`);
        if (!res.ok) throw new Error('Quiz introuvable');
        setQuiz(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) fetchQuiz();
  }, [quizId, userLoading]);

  const handleSelectOption = (questionId: number, optionId: number) => {
    if (result) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!prismaUser || !quiz || submitting) return;
    setSubmitting(true);

    const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
      questionId: Number(questionId),
      optionId,
    }));

    try {
      const res = await fetch(`${config.apiUrl}/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: prismaUser.id, answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);

        // Also mark lesson as completed if passed
        if (data.passed && quiz.lesson) {
          await fetch(`${config.apiUrl}/lessons/${quiz.lesson.id}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: prismaUser.id }),
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setResult(null);
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

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />
        <div className="pt-32 text-center">
          <p className="text-gray-500">Quiz introuvable ou vide</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;
  const allAnswered = answeredCount === totalQuestions;

  // Result screen
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 text-center"
          >
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                result.passed ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              {result.passed ? (
                <Trophy className="w-10 h-10 text-emerald-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {result.passed ? 'Felicitations !' : 'Dommage...'}
            </h1>
            <p className="text-gray-500 mb-6">
              {result.passed
                ? 'Vous avez reussi le quiz !'
                : `Score minimum requis : ${quiz.passingScore}%`}
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className={`text-4xl font-bold ${result.passed ? 'text-emerald-600' : 'text-red-500'}`}>
                  {result.score}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Score</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">
                  {result.correctCount}/{result.totalQuestions}
                </p>
                <p className="text-xs text-gray-500 mt-1">Bonnes reponses</p>
              </div>
            </div>

            {/* Show correct answers */}
            <div className="text-left space-y-4 mb-8">
              {quiz.questions.map((q, index) => {
                const selectedOptionId = selectedAnswers[q.id];
                const correctOption = q.options.find((o) => o.isCorrect);
                const isCorrect = selectedOptionId === correctOption?.id;

                return (
                  <div key={q.id} className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {index + 1}. {q.text}
                      </p>
                    </div>
                    {!isCorrect && correctOption && (
                      <p className="text-xs text-emerald-600 ml-6">
                        Bonne reponse : {correctOption.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!result.passed && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="border-[#1E7F88] text-[#1E7F88]"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reessayer
                </Button>
              )}
              <Button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="bg-[#1E7F88] hover:bg-[#176570] text-white"
              >
                Retour au cours
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="courses" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back button */}
        <button
          onClick={() => router.push(`/courses/${courseId}/lessons/${quiz.lesson.id}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a la lecon
        </button>

        {/* Quiz header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileQuestion className="w-5 h-5 text-[#F1843F]" />
            <h1 className="text-lg font-bold text-gray-900">{quiz.title}</h1>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>Question {currentQuestion + 1} / {totalQuestions}</span>
            <span>{answeredCount} repondue{answeredCount > 1 ? 's' : ''}</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-gray-100 mb-6">
              <CardContent className="p-6">
                <p className="text-base font-medium text-gray-900 mb-5">
                  {question.text}
                </p>

                <div className="space-y-2.5">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswers[question.id] === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(question.id, option.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-sm ${
                          isSelected
                            ? 'border-[#1E7F88] bg-[#1E7F88]/5 text-[#1E7F88]'
                            : 'border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#1E7F88]' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#1E7F88]" />
                            )}
                          </div>
                          {option.text}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Precedente
          </Button>

          {currentQuestion < totalQuestions - 1 ? (
            <Button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="bg-[#1E7F88] hover:bg-[#176570] text-white"
            >
              Suivante
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="bg-[#F1843F] hover:bg-[#d9722f] text-white"
            >
              {submitting ? 'Envoi...' : 'Valider le quiz'}
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question dots navigation */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {quiz.questions.map((q, index) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = index === currentQuestion;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'w-6 bg-[#1E7F88]'
                    : isAnswered
                      ? 'bg-[#1E7F88]/40'
                      : 'bg-gray-200'
                }`}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
