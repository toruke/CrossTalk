'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { getDisplayName } from '@/src/lib/displayName';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { BookOpen, Users, Plus, Trash2 } from 'lucide-react';
import { ChatPopup } from '@/src/components/ChatPopup';

const LANGUAGES = ['Anglais', 'Espagnol', 'Allemand', 'Japonais', 'Italien', 'Chinois', 'Portugais', 'Arabe'];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LANGUAGE_FLAGS: Record<string, string> = {
  'Anglais': '🇬🇧',
  'Espagnol': '🇪🇸',
  'Allemand': '🇩🇪',
  'Japonais': '🇯🇵',
  'Italien': '🇮🇹',
  'Chinois': '🇨🇳',
  'Portugais': '🇵🇹',
  'Arabe': '🇸🇦',
};

interface Course {
  id: number;
  language: string;
  level: string;
  enrollments: Array<{
    user: { id: number; name: string; email: string };
  }>;
}

export default function MyCoursesPage() {
  const router = useRouter();
  const { prismaUser, isEleve, isProf, loading: userLoading } = usePrismaUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<{ contactId: string; contactName: string } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (userLoading || !prismaUser) return;
      if (isEleve) {
        // Élève : cours inscrits
        try {
          const res = await fetch(`${config.apiUrl}/courses/my/${prismaUser.id}`);
          if (res.ok) {
            const data = await res.json();
            setCourses(data);
          }
        } catch (err) {
          console.error('Erreur:', err);
        } finally {
          setLoading(false);
        }
      } else if (isProf) {
        // Professeur : cours enseignés
        try {
          const res = await fetch(`${config.apiUrl}/courses/teacher/${prismaUser.id}`);
          if (res.ok) {
            const data = await res.json();
            setCourses(data);
          }
        } catch (err) {
          console.error('Erreur:', err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/courses');
      }
    };
    fetchCourses();
  }, [prismaUser, isEleve, isProf, userLoading, router]);

  if (!userLoading && !isEleve && !isProf) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)} currentPage="my-courses" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Mes cours</h1>
        {loading || userLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun cours</h3>
            <p className="text-gray-500 mb-6">{isEleve ? 'Inscrivez-vous à un cours pour commencer à apprendre !' : 'Créez un cours pour commencer à enseigner !'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{LANGUAGE_FLAGS[course.language] || '🌍'}</span>
                      <span className="font-bold text-lg text-gray-900">{course.language}</span>
                      <Badge className="ml-auto bg-[#1E7F88]/10 text-[#1E7F88] border-0">{course.level}</Badge>
                    </div>
                    {isEleve && (
                      <>
                        <div className="text-sm text-gray-500 mb-2">
                          Professeur : <span className="font-medium text-gray-800">{getDisplayName(course.teacher)}</span>
                        </div>
                        <Button
                          onClick={() => setActiveChat({ contactId: String(course.teacher.id), contactName: getDisplayName(course.teacher) })}
                          className="w-full bg-[#1E7F88] hover:bg-[#176570] text-white mt-4"
                        >
                          Chat avec le professeur
                        </Button>
                        <Button
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="w-full mt-2 bg-[#1E7F88] hover:bg-[#176570] text-white"
                        >
                          Accéder au cours
                        </Button>
                      </>
                    )}
                    {isProf && (
                      <>
                        <div className="text-sm text-gray-500 mb-2">
                          {course.enrollments?.length ?? 0} élève{course.enrollments?.length !== 1 ? 's' : ''} inscrit{course.enrollments?.length !== 1 ? 's' : ''}
                        </div>
                        <Button
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="w-full mt-2 bg-[#1E7F88] hover:bg-[#176570] text-white"
                        >
                          Accéder au cours
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
