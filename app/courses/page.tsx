'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { api } from '@/src/services/api';
import { config } from '@/src/lib/config';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { getDisplayName } from '@/src/lib/displayName';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { ChatPopup } from '@/src/components/ChatPopup';
import { MessageCircle, GraduationCap, BookOpen, X, Check, Plus } from 'lucide-react';

interface CourseDisplay {
  id: string;
  language: string;
  level: string;
  teacher: string;
  teacherId: string;
}

const LANGUAGE_FLAGS: Record<string, string> = {
  'Anglais': '🇬🇧',
  'Espagnol': '🇪🇸',
  'Allemand': '🇩🇪',
  'Japonais': '🇯🇵',
  'Italien': '🇮🇹',
  'Chinois': '🇨🇳',
};

const LANGUAGE_COLORS: Record<string, { bg: string; text: string }> = {
  'Anglais': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Espagnol': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Allemand': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'Japonais': { bg: 'bg-red-50', text: 'text-red-700' },
  'Italien': { bg: 'bg-green-50', text: 'text-green-700' },
  'Chinois': { bg: 'bg-rose-50', text: 'text-rose-700' },
};

const getLevelBadge = (level: string) => {
  if (level.includes('A1') || level.includes('A2')) {
    return { label: 'Debutant', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  } else if (level.includes('B1') || level.includes('B2')) {
    return { label: 'Intermediaire', className: 'bg-sky-50 text-sky-700 border-sky-200' };
  } else if (level.includes('C1') || level.includes('C2')) {
    return { label: 'Avance', className: 'bg-violet-50 text-violet-700 border-violet-200' };
  }
  return { label: level, className: 'bg-gray-50 text-gray-700 border-gray-200' };
};

export default function CoursesPage() {
  const router = useRouter();
  const { prismaUser, isEleve, isProf, loading: userLoading } = usePrismaUser();
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ contactId: string; contactName: string } | null>(null);

  // Rediriger les PROF vers leur page dédiée
  useEffect(() => {
    if (!userLoading && isProf) {
      router.push('/my-courses');
    }
  }, [userLoading, isProf, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      // Ne pas charger si c'est un PROF (il sera redirigé)
      if (isProf) return;
      
      try {
        const apiCourses = await api.getCourses();
        const displayCourses: CourseDisplay[] = apiCourses.map((course) => ({
          id: String(course.id),
          language: course.language || 'Langue',
          level: course.level || 'Tous niveaux',
          teacher: course.teacher ? getDisplayName(course.teacher) : 'Professeur',
          teacherId: String(course.teacher?.id || course.teacherId),
        }));
        setCourses(displayCourses);

        // Si l'utilisateur est connecté et est un élève, récupérer ses inscriptions
        if (prismaUser && isEleve) {
          const myCourses = await api.getMyCourses(String(prismaUser.id));
          setEnrolledCourseIds(new Set(myCourses.map((c) => String(c.id))));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Impossible de charger les cours.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [prismaUser, isEleve, isProf]);

  const handleEnroll = async (courseId: string) => {
    if (!prismaUser) {
      router.push('/sign-in');
      return;
    }

    setEnrollingId(courseId);
    try {
      const res = await fetch(`${config.apiUrl}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: prismaUser.id, courseId: Number(courseId) }),
      });

      if (res.ok) {
        setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur inscription:', err);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') router.push('/');
    if (page === 'teachers') router.push('/teachers');
    if (page === 'courses') router.push('/courses');
    if (page === 'students') router.push('/students');
    if (page === 'my-courses') router.push('/my-courses');
  };

  const filteredCourses = courses.filter((course) => {
    const matchLanguage = filterLanguage === 'all' || course.language === filterLanguage;
    const matchLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchLanguage && matchLevel;
  });

  const languages = [...new Set(courses.map((c) => c.language))];
  const levels = [...new Set(courses.map((c) => c.level))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onNavigate={handleNavigate} currentPage="courses" />
        <div className="pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage="courses" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs border-[#F1843F]/20 text-[#F1843F] bg-[#F1843F]/5">
            <GraduationCap className="w-3 h-3 mr-1" />
            Catalogue
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Tous les cours</h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Trouvez le cours de langue qui vous convient et commencez a apprendre
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-4">
          {/* Language pills */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Langue</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLanguage('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterLanguage === 'all'
                    ? 'bg-[#1E7F88] text-white shadow-md shadow-[#1E7F88]/20'
                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                }`}
              >
                Toutes
              </button>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setFilterLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                    filterLanguage === lang
                      ? 'bg-[#1E7F88] text-white shadow-md shadow-[#1E7F88]/20'
                      : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{LANGUAGE_FLAGS[lang] || '🌍'}</span>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Level pills + count */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Niveau</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterLevel('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filterLevel === 'all'
                      ? 'bg-[#F1843F] text-white shadow-md shadow-[#F1843F]/20'
                      : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Tous
                </button>
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterLevel === level
                        ? 'bg-[#F1843F] text-white shadow-md shadow-[#F1843F]/20'
                        : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(filterLanguage !== 'all' || filterLevel !== 'all') && (
                <button
                  onClick={() => { setFilterLanguage('all'); setFilterLevel('all'); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Reinitialiser
                </button>
              )}
              <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
                {filteredCourses.length} cours
              </Badge>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm mb-8">
            {error}
          </div>
        )}

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course, index) => {
            const colors = LANGUAGE_COLORS[course.language] || { bg: 'bg-gray-50', text: 'text-gray-700' };
            const levelBadge = getLevelBadge(course.level);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className={`px-6 pt-6 pb-4 ${colors.bg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{LANGUAGE_FLAGS[course.language] || '🌍'}</span>
                        <div>
                          <h3 className={`text-lg font-bold ${colors.text}`}>{course.language}</h3>
                          <p className="text-xs text-gray-500">Niveau {course.level}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${levelBadge.className}`}>
                        {levelBadge.label}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="pt-4 pb-5 px-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E7F88] to-[#F1843F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {course.teacher.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{course.teacher}</p>
                        <p className="text-xs text-gray-400">Professeur de {course.language}</p>
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <div className="flex gap-2">
                      {isEleve && !enrolledCourseIds.has(course.id) && (
                        <Button
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollingId === course.id}
                          variant="outline"
                          className="flex-1 border-[#1E7F88] text-[#1E7F88] hover:bg-[#1E7F88]/5"
                        >
                          {enrollingId === course.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1E7F88] border-t-transparent" />
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1.5" />
                              S'inscrire
                            </>
                          )}
                        </Button>
                      )}
                      {isEleve && enrolledCourseIds.has(course.id) && (
                        <Button
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <BookOpen className="w-4 h-4 mr-1.5" />
                          Acceder au cours
                        </Button>
                      )}
                      <Button
                        onClick={() => setActiveChat({ contactId: course.teacherId, contactName: course.teacher })}
                        className={`${isEleve ? 'flex-1' : 'w-full'} bg-[#1E7F88] hover:bg-[#176570] text-white rounded-lg`}
                      >
                        <MessageCircle className="w-4 h-4 mr-1.5" />
                        {isEleve ? 'Chat' : 'Contacter le prof'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun cours trouve</h3>
            <p className="text-sm text-gray-500">Essayez de modifier vos filtres</p>
          </div>
        )}

        {/* Chat Popup */}
        <AnimatePresence>
          {activeChat && (
            <ChatPopup
              contactId={activeChat.contactId}
              contactName={activeChat.contactName}
              onClose={() => setActiveChat(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
