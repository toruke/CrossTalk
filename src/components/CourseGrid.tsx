'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { api } from '@/src/services/api';
import { getDisplayName } from '@/src/lib/displayName';
import { ChatPopup } from './ChatPopup';
import { MessageCircle, GraduationCap, ArrowRight } from 'lucide-react';

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

const LANGUAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Anglais': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  'Espagnol': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  'Allemand': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  'Japonais': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
  'Italien': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  'Chinois': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
};

const getLevelBadge = (level: string) => {
  if (level.includes('A1') || level.includes('Debutant')) {
    return { label: 'Debutant', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  } else if (level.includes('A2') || level.includes('B1') || level.includes('Intermediaire')) {
    return { label: 'Intermediaire', className: 'bg-sky-50 text-sky-700 border-sky-200' };
  }
  return { label: 'Avance', className: 'bg-violet-50 text-violet-700 border-violet-200' };
};

export const CourseGrid = ({ limit }: { limit?: number }) => {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ contactId: string; contactName: string } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiCourses = await api.getCourses();
        console.log('API Courses:', apiCourses[0]); // Debug
        const displayCourses: CourseDisplay[] = apiCourses.map((course) => {
          const teacherName = course.teacher ? getDisplayName(course.teacher) : 'Professeur';
          console.log('Teacher:', course.teacher, '-> Display name:', teacherName); // Debug
          return {
            id: String(course.id),
            language: course.language || 'Langue',
            level: course.level || 'Tous niveaux',
            teacher: teacherName,
            teacherId: String(course.teacher?.id || course.teacherId),
          };
        });
        setCourses(displayCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Impossible de charger les cours.');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent mx-auto" />
          <p className="text-gray-500 text-sm mt-4">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs border-[#F1843F]/20 text-[#F1843F] bg-[#F1843F]/5">
            <GraduationCap className="w-3 h-3 mr-1" />
            Catalogue
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Nos cours de langues</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Choisissez votre langue et commencez a apprendre avec un professeur natif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(limit ? courses.slice(0, limit) : courses).map((course, index) => {
            const colors = LANGUAGE_COLORS[course.language] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
            const levelBadge = getLevelBadge(course.level);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Language header strip */}
                  <div className={`px-6 pt-6 pb-4 ${colors.bg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{LANGUAGE_FLAGS[course.language] || '🌍'}</span>
                        <div>
                          <h3 className={`text-lg font-bold ${colors.text}`}>
                            {course.language}
                          </h3>
                          <p className="text-xs text-gray-500">Niveau {course.level}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${levelBadge.className}`}>
                        {levelBadge.label}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="pt-4 pb-5 px-6">
                    {/* Teacher info */}
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

                    <Button
                      onClick={() => {
                        setActiveChat({ contactId: course.teacherId, contactName: course.teacher });
                      }}
                      className="w-full bg-[#1E7F88] hover:bg-[#176570] text-white rounded-lg group/btn"
                    >
                      <MessageCircle className="w-4 h-4 mr-1.5" />
                      Contacter le prof
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bouton "Plus de cours" si limite atteinte */}
        {limit && courses.length > limit && (
          <div className="text-center mt-10">
            <Button
              onClick={() => router.push('/courses')}
              variant="outline"
              className="px-8 py-3 text-[#1E7F88] border-[#1E7F88] hover:bg-[#1E7F88]/5 rounded-xl group"
            >
              Voir tous les cours
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

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
    </div>
  );
};
