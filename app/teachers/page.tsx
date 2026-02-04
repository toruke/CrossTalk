'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from '@/src/components/Navbar';
import { api, Teacher } from '@/src/services/api';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { getDisplayName, getInitials } from '@/src/lib/displayName';
import { ChatPopup } from '@/src/components/ChatPopup';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { MessageCircle, Users, Mail } from 'lucide-react';

export default function TeachersPage() {
  const router = useRouter();
  const { prismaUser, role, isAdmin, isProf, loading: userLoading } = usePrismaUser();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ contactId: string; contactName: string } | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (userLoading || !prismaUser) return;
      
      try {
        setLoading(true);
        let data: Teacher[];
        if (isAdmin) {
          data = await api.getAllTeachers();
        } else {
          data = await api.getMyTeachers(String(prismaUser.id));
        }
        setTeachers(data);
      } catch (err) {
        setError('Impossible de charger les professeurs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [prismaUser, isAdmin, userLoading]);

  const handleTeacherSelect = (teacherId: string, teacherName: string) => {
    setActiveChat({ contactId: teacherId, contactName: teacherName });
  };

  // Si c'est un PROF, rediriger vers la page des élèves
  if (!userLoading && isProf) {
    router.push('/students');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)} currentPage="teachers" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs border-[#1E7F88]/20 text-[#1E7F88] bg-[#1E7F88]/5">
            <Users className="w-3 h-3 mr-1" />
            {isAdmin ? 'Administration' : 'Mon equipe'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {isAdmin ? 'Tous les professeurs' : 'Mes professeurs'}
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            {isAdmin
              ? 'Liste complete des professeurs de la plateforme'
              : 'Professeurs des cours auxquels vous etes inscrit(e)'}
          </p>
        </div>

        {(loading || userLoading) && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm mb-8">
            {error}
          </div>
        )}

        {!loading && !error && teachers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun professeur</h3>
            <p className="text-sm text-gray-500">
              {isAdmin
                ? "Aucun professeur n'est enregistre sur la plateforme."
                : 'Inscrivez-vous a un cours pour voir vos professeurs.'}
            </p>
          </div>
        )}

        {!loading && !error && teachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Teacher avatar + name */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#1E7F88] to-[#F1843F] rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                        {getInitials(teacher)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{getDisplayName(teacher)}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Mail className="w-3 h-3" />
                          <p className="text-xs truncate">{teacher.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Courses taught */}
                    <div className="mb-5">
                      <p className="text-xs font-medium text-gray-500 mb-2.5">Cours enseignes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.coursesTaught.map((course) => (
                          <Badge
                            key={course.id}
                            variant="outline"
                            className="text-[10px] bg-[#1E7F88]/5 text-[#1E7F88] border-[#1E7F88]/15"
                          >
                            {course.language}
                            {course.level && <span className="text-gray-400 ml-1">· {course.level}</span>}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    <Button
                      onClick={() => handleTeacherSelect(teacher.id, getDisplayName(teacher))}
                      className="w-full bg-[#1E7F88] hover:bg-[#176570] text-white rounded-lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-1.5" />
                      Contacter
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

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
}
