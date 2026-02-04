'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  GripVertical,
  Save,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';

interface QuizQuestion {
  id?: number;
  text: string;
  order: number;
  options: { id?: number; text: string; isCorrect: boolean; order: number }[];
}

interface QuizData {
  id?: number;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

interface LessonData {
  id?: number;
  title: string;
  order: number;
  quiz: QuizData | null;
}

interface CourseData {
  id: number;
  language: string;
  level: string;
  description: string | null;
  teacherId: number;
  lessons: {
    id: number;
    title: string;
    order: number;
    quiz: { id: number; title: string; passingScore: number } | null;
  }[];
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { prismaUser, isProf, loading: userLoading } = usePrismaUser();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const courseId = params.id as string;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/courses/${courseId}`);
        if (!res.ok) throw new Error('Cours introuvable');
        const data: CourseData = await res.json();
        setCourse(data);
        setDescription(data.description || '');

        // Load full lesson data for each lesson
        const lessonsWithContent: LessonData[] = await Promise.all(
          data.lessons.map(async (l) => {
            const lessonRes = await fetch(`${config.apiUrl}/lessons/${l.id}`);
            const lessonData = await lessonRes.json();

            let quizData: QuizData | null = null;
            if (l.quiz) {
              const quizRes = await fetch(`${config.apiUrl}/quizzes/${l.quiz.id}`);
              if (quizRes.ok) {
                const qd = await quizRes.json();
                quizData = {
                  id: qd.id,
                  title: qd.title,
                  passingScore: qd.passingScore,
                  questions: qd.questions.map((q: { id: number; text: string; order: number; options: { id: number; text: string; isCorrect: boolean; order: number }[] }) => ({
                    id: q.id,
                    text: q.text,
                    order: q.order,
                    options: q.options.map((o) => ({
                      id: o.id,
                      text: o.text,
                      isCorrect: o.isCorrect,
                      order: o.order,
                    })),
                  })),
                };
              }
            }

            return {
              id: lessonData.id,
              title: lessonData.title,
              order: lessonData.order,
              quiz: quizData,
            };
          })
        );

        setLessons(lessonsWithContent.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) fetchCourse();
  }, [courseId, userLoading]);

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        title: '',
        order: prev.length,
        quiz: null,
      },
    ]);
    setExpandedLesson(lessons.length);
  };

  const removeLesson = async (index: number) => {
    const lesson = lessons[index];
    if (lesson.id) {
      await fetch(`${config.apiUrl}/lessons/${lesson.id}`, { method: 'DELETE' });
    }
    setLessons((prev) => prev.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i })));
    if (expandedLesson === index) setExpandedLesson(null);
  };

  const updateLesson = (index: number, field: keyof LessonData, value: string) => {
    setLessons((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const addQuizToLesson = (lessonIndex: number) => {
    setLessons((prev) =>
      prev.map((l, i) =>
        i === lessonIndex
          ? {
              ...l,
              quiz: {
                title: `QCM - ${l.title || 'Lecon ' + (i + 1)}`,
                passingScore: 70,
                questions: [
                  {
                    text: '',
                    order: 0,
                    options: [
                      { text: '', isCorrect: true, order: 0 },
                      { text: '', isCorrect: false, order: 1 },
                    ],
                  },
                ],
              },
            }
          : l
      )
    );
    setEditingQuiz(lessonIndex);
  };

  const removeQuiz = async (lessonIndex: number) => {
    const lesson = lessons[lessonIndex];
    if (lesson.quiz?.id) {
      await fetch(`${config.apiUrl}/quizzes/${lesson.quiz.id}`, { method: 'DELETE' });
    }
    setLessons((prev) =>
      prev.map((l, i) => (i === lessonIndex ? { ...l, quiz: null } : l))
    );
    setEditingQuiz(null);
  };

  const updateQuizQuestion = (
    lessonIndex: number,
    questionIndex: number,
    field: string,
    value: string
  ) => {
    setLessons((prev) =>
      prev.map((l, li) => {
        if (li !== lessonIndex || !l.quiz) return l;
        return {
          ...l,
          quiz: {
            ...l.quiz,
            questions: l.quiz.questions.map((q, qi) =>
              qi === questionIndex ? { ...q, [field]: value } : q
            ),
          },
        };
      })
    );
  };

  const updateQuizOption = (
    lessonIndex: number,
    questionIndex: number,
    optionIndex: number,
    field: string,
    value: string | boolean
  ) => {
    setLessons((prev) =>
      prev.map((l, li) => {
        if (li !== lessonIndex || !l.quiz) return l;
        return {
          ...l,
          quiz: {
            ...l.quiz,
            questions: l.quiz.questions.map((q, qi) => {
              if (qi !== questionIndex) return q;
              return {
                ...q,
                options: q.options.map((o, oi) => {
                  if (field === 'isCorrect') {
                    return { ...o, isCorrect: oi === optionIndex };
                  }
                  return oi === optionIndex ? { ...o, [field]: value } : o;
                }),
              };
            }),
          },
        };
      })
    );
  };

  const addQuestion = (lessonIndex: number) => {
    setLessons((prev) =>
      prev.map((l, li) => {
        if (li !== lessonIndex || !l.quiz) return l;
        return {
          ...l,
          quiz: {
            ...l.quiz,
            questions: [
              ...l.quiz.questions,
              {
                text: '',
                order: l.quiz.questions.length,
                options: [
                  { text: '', isCorrect: true, order: 0 },
                  { text: '', isCorrect: false, order: 1 },
                ],
              },
            ],
          },
        };
      })
    );
  };

  const removeQuestion = (lessonIndex: number, questionIndex: number) => {
    setLessons((prev) =>
      prev.map((l, li) => {
        if (li !== lessonIndex || !l.quiz) return l;
        return {
          ...l,
          quiz: {
            ...l.quiz,
            questions: l.quiz.questions
              .filter((_, qi) => qi !== questionIndex)
              .map((q, qi) => ({ ...q, order: qi })),
          },
        };
      })
    );
  };

  const addOption = (lessonIndex: number, questionIndex: number) => {
    setLessons((prev) =>
      prev.map((l, li) => {
        if (li !== lessonIndex || !l.quiz) return l;
        return {
          ...l,
          quiz: {
            ...l.quiz,
            questions: l.quiz.questions.map((q, qi) => {
              if (qi !== questionIndex) return q;
              return {
                ...q,
                options: [
                  ...q.options,
                  { text: '', isCorrect: false, order: q.options.length },
                ],
              };
            }),
          },
        };
      })
    );
  };

  const removeOption = (lessonIndex: number, questionIndex: number, optionIndex: number) => {
    setLessons((prev) =>
      prev.map((l, li) => {
        if (li !== lessonIndex || !l.quiz) return l;
        return {
          ...l,
          quiz: {
            ...l.quiz,
            questions: l.quiz.questions.map((q, qi) => {
              if (qi !== questionIndex) return q;
              const newOptions = q.options
                .filter((_, oi) => oi !== optionIndex)
                .map((o, oi) => ({ ...o, order: oi }));
              // Ensure at least one correct
              if (!newOptions.some((o) => o.isCorrect) && newOptions.length > 0) {
                newOptions[0].isCorrect = true;
              }
              return { ...q, options: newOptions };
            }),
          },
        };
      })
    );
  };

  const handleSave = async () => {
    if (!prismaUser || saving) return;
    setSaving(true);
    setSaveMessage('');

    try {
      // Update course description
      await fetch(`${config.apiUrl}/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      // Save each lesson
      for (const lesson of lessons) {
        if (!lesson.title.trim()) continue;

        let savedLesson;
        if (lesson.id) {
          // Update existing
          const res = await fetch(`${config.apiUrl}/lessons/${lesson.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: lesson.title,
              order: lesson.order,
            }),
          });
          savedLesson = await res.json();
        } else {
          // Create new
          const res = await fetch(`${config.apiUrl}/lessons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId: Number(courseId),
              title: lesson.title,
              order: lesson.order,
            }),
          });
          savedLesson = await res.json();
          lesson.id = savedLesson.id;
        }

        // Handle quiz
        if (lesson.quiz && lesson.id) {
          if (lesson.quiz.id) {
            // Delete existing quiz and recreate (simpler than patching)
            await fetch(`${config.apiUrl}/quizzes/${lesson.quiz.id}`, { method: 'DELETE' });
          }

          const validQuestions = lesson.quiz.questions.filter(
            (q) => q.text.trim() && q.options.some((o) => o.text.trim())
          );

          if (validQuestions.length > 0) {
            const quizRes = await fetch(`${config.apiUrl}/quizzes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lessonId: lesson.id,
                title: lesson.quiz.title,
                passingScore: lesson.quiz.passingScore,
                questions: validQuestions.map((q) => ({
                  text: q.text,
                  order: q.order,
                  options: q.options
                    .filter((o) => o.text.trim())
                    .map((o) => ({
                      text: o.text,
                      isCorrect: o.isCorrect,
                      order: o.order,
                    })),
                })),
              }),
            });

            if (quizRes.ok) {
              const savedQuiz = await quizRes.json();
              lesson.quiz.id = savedQuiz.id;
            }
          }
        }
      }

      setSaveMessage('Sauvegarde reussie !');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="my-courses" />
        <div className="pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="my-courses" />
        <div className="pt-32 text-center">
          <p className="text-gray-500">Cours introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar onNavigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)} currentPage="my-courses" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back */}
        <button
          onClick={() => router.push('/my-courses')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a mes cours
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge variant="outline" className="mb-3 text-xs border-[#1E7F88]/20 text-[#1E7F88] bg-[#1E7F88]/5">
              {course.language} - {course.level}
            </Badge>
            <h1 className="text-2xl font-bold text-gray-900">Editer le cours</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1E7F88] hover:bg-[#176570] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>

        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-3 rounded-xl text-sm font-medium ${
              saveMessage.includes('Erreur')
                ? 'bg-red-50 text-red-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {saveMessage}
          </motion.div>
        )}

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du cours
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Decrivez le contenu et les objectifs de ce cours..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E7F88]/20 focus:border-[#1E7F88] resize-none"
          />
        </div>

        {/* Lessons */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1E7F88]" />
            Lecons ({lessons.length})
          </h2>
          <Button
            onClick={addLesson}
            variant="outline"
            size="sm"
            className="border-[#1E7F88] text-[#1E7F88]"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter une lecon
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {lessons.map((lesson, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                {/* Lesson header */}
                <div
                  className="p-5 flex items-center gap-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() =>
                    setExpandedLesson(expandedLesson === index ? null : index)
                  }
                >
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-[#1E7F88]/10 text-[#1E7F88] flex items-center justify-center text-sm font-semibold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {lesson.title || 'Nouvelle lecon'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {lesson.quiz && (
                        <Badge variant="outline" className="text-[10px] border-[#F1843F]/20 text-[#F1843F]">
                          QCM ({lesson.quiz.questions.length} questions)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLesson(index);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {expandedLesson === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Expanded content */}
                {expandedLesson === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5 border-t border-gray-100"
                  >
                    <div className="pt-5 space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Titre de la lecon
                        </label>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(index, 'title', e.target.value)}
                          placeholder="Ex: Les salutations"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E7F88]/20 focus:border-[#1E7F88]"
                        />
                      </div>

                      {/* Quiz section */}
                      {!lesson.quiz ? (
                        <Button
                          onClick={() => addQuizToLesson(index)}
                          variant="outline"
                          className="border-[#F1843F]/30 text-[#F1843F] hover:bg-[#F1843F]/5 w-full"
                        >
                          <FileQuestion className="w-4 h-4 mr-2" />
                          Ajouter un QCM a cette lecon
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <FileQuestion className="w-4 h-4 text-[#F1843F]" />
                              QCM
                            </h3>
                            <Button
                              onClick={() => removeQuiz(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-600 text-xs"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Supprimer le QCM
                            </Button>
                          </div>

                          {/* Quiz title */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Titre du QCM
                              </label>
                              <input
                                type="text"
                                value={lesson.quiz.title}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setLessons((prev) =>
                                    prev.map((l, i) =>
                                      i === index && l.quiz
                                        ? { ...l, quiz: { ...l.quiz, title: val } }
                                        : l
                                    )
                                  );
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F1843F]/20 focus:border-[#F1843F]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Score minimum (%)
                              </label>
                              <input
                                type="number"
                                value={lesson.quiz.passingScore}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setLessons((prev) =>
                                    prev.map((l, i) =>
                                      i === index && l.quiz
                                        ? { ...l, quiz: { ...l.quiz, passingScore: val } }
                                        : l
                                    )
                                  );
                                }}
                                min={0}
                                max={100}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F1843F]/20 focus:border-[#F1843F]"
                              />
                            </div>
                          </div>

                          {/* Questions */}
                          {lesson.quiz.questions.map((question, qi) => (
                            <div key={qi} className="bg-gray-50 rounded-xl p-4 space-y-3">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-bold text-gray-400 mt-2.5">
                                  Q{qi + 1}
                                </span>
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) =>
                                      updateQuizQuestion(index, qi, 'text', e.target.value)
                                    }
                                    placeholder="Ecrivez la question..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F1843F]/20 focus:border-[#F1843F]"
                                  />
                                </div>
                                {lesson.quiz!.questions.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:text-red-600"
                                    onClick={() => removeQuestion(index, qi)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>

                              {/* Options */}
                              <div className="ml-6 space-y-2">
                                {question.options.map((option, oi) => (
                                  <div key={oi} className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        updateQuizOption(index, qi, oi, 'isCorrect', true)
                                      }
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                        option.isCorrect
                                          ? 'border-emerald-500 bg-emerald-500'
                                          : 'border-gray-300 hover:border-gray-400'
                                      }`}
                                    >
                                      {option.isCorrect && (
                                        <Check className="w-3 h-3 text-white" />
                                      )}
                                    </button>
                                    <input
                                      type="text"
                                      value={option.text}
                                      onChange={(e) =>
                                        updateQuizOption(
                                          index,
                                          qi,
                                          oi,
                                          'text',
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${oi + 1}`}
                                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F1843F]/20 focus:border-[#F1843F]"
                                    />
                                    {question.options.length > 2 && (
                                      <button
                                        onClick={() => removeOption(index, qi, oi)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {question.options.length < 6 && (
                                  <button
                                    onClick={() => addOption(index, qi)}
                                    className="text-xs text-[#F1843F] hover:text-[#d9722f] ml-7"
                                  >
                                    + Ajouter une option
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}

                          <Button
                            onClick={() => addQuestion(index)}
                            variant="outline"
                            size="sm"
                            className="border-[#F1843F]/30 text-[#F1843F] hover:bg-[#F1843F]/5"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Ajouter une question
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {lessons.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Aucune lecon pour le moment</p>
              <Button
                onClick={addLesson}
                className="bg-[#1E7F88] hover:bg-[#176570] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Creer la premiere lecon
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
