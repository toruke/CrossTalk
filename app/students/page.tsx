'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { config } from '@/src/lib/config';
import { getDisplayName, getInitials } from '@/src/lib/displayName';
import { ChatPopup } from '@/src/components/ChatPopup';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { MessageCircle, Users, GraduationCap } from 'lucide-react';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  clerkId: string;
  courses: Array<{ id: number; language: string; level: string }>;
}

export default function StudentsPage() {
  const router = useRouter();
  const { prismaUser, isProf, isAdmin, loading: userLoading } = usePrismaUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ contactId: string; contactName: string } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (userLoading || !prismaUser) return;
      
      // Seuls les PROF et ADMIN peuvent voir cette page
      if (!isProf && !isAdmin) {
        router.push('/teachers');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${config.apiUrl}/my-students/${prismaUser.id}`);
        if (!res.ok) throw new Error('Erreur');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError('Impossible de charger les élèves');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [prismaUser, isProf, isAdmin, userLoading, router]);

  const handleStudentSelect = (studentId: number, studentName: string) => {
    setActiveChat({ contactId: String(studentId), contactName: studentName });
  };

  // Rediriger les élèves vers la page des professeurs
  if (!userLoading && !isProf && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)} currentPage="students" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs border-[#1E7F88]/20 text-[#1E7F88] bg-[#1E7F88]/5">
            <GraduationCap className="w-3 h-3 mr-1" />
            Mes élèves
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Élèves inscrits à vos cours
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Retrouvez tous les élèves inscrits à vos cours et échangez avec eux
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

        {!loading && !userLoading && students.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun élève inscrit
            </h3>
            <p className="text-gray-500">
              Vos élèves apparaîtront ici une fois inscrits à vos cours
            </p>
          </div>
        )}

        {!loading && !userLoading && students.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {getInitials(student)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {getDisplayName(student)}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Inscrit à :</p>
                      <div className="flex flex-wrap gap-2">
                        {student.courses.map((course) => (
                          <Badge
                            key={course.id}
                            variant="secondary"
                            className="text-xs bg-[#1E7F88]/10 text-[#1E7F88] hover:bg-[#1E7F88]/20"
                          >
                            {course.language} {course.level}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStudentSelect(student.id, getDisplayName(student))}
                      className="w-full mt-4 bg-[#1E7F88] hover:bg-[#1E7F88]/90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Envoyer un message
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
