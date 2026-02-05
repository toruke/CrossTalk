'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Navbar } from '@/src/components/Navbar';
import { usePrismaUser } from '@/src/hooks/usePrismaUser';
import { api, AdminUser, AdminStats } from '@/src/services/api';
import { getDisplayName, getInitials } from '@/src/lib/displayName';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/src/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/src/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from '@/src/components/ui/alert-dialog';
import {
  Shield, Users, GraduationCap, BookOpen, TrendingUp,
  Trash2, UserCog
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { prismaUser, isAdmin, loading: userLoading } = usePrismaUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [changingRoleId, setChangingRoleId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect non-admin
  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.push('/');
    }
  }, [userLoading, isAdmin, router]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (userLoading || !prismaUser || !isAdmin) return;
      try {
        setLoading(true);
        const [statsData, usersData] = await Promise.all([
          api.getAdminStats(),
          api.getAllUsers(),
        ]);
        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        setError('Impossible de charger les donnees du dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [prismaUser, isAdmin, userLoading]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setChangingRoleId(userId);
    try {
      const updated = await api.changeUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (err) {
      console.error('Erreur changement de role:', err);
    } finally {
      setChangingRoleId(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setDeletingId(userId);
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleNavigate = (page: string) => {
    router.push(page === 'home' ? '/' : `/${page}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' ||
      getDisplayName(user).toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!userLoading && !isAdmin) return null;

  const statCards = stats ? [
    {
      label: 'Utilisateurs',
      value: stats.users.total,
      icon: Users,
      color: '#1E7F88',
      detail: `${stats.users.profs} profs, ${stats.users.eleves} eleves`,
    },
    {
      label: 'Cours',
      value: stats.courses.total,
      icon: BookOpen,
      color: '#F1843F',
      detail: `${stats.lessons.total} lecons au total`,
    },
    {
      label: 'Inscriptions',
      value: stats.enrollments.total,
      icon: GraduationCap,
      color: '#8B5CF6',
      detail: 'Inscriptions actives',
    },
    {
      label: 'Quiz completes',
      value: stats.quizAttempts.total,
      icon: TrendingUp,
      color: '#10B981',
      detail: 'Tentatives de quiz',
    },
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentPage="admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs border-red-200 text-red-700 bg-red-50">
            <Shield className="w-3 h-3 mr-1" />
            Administration
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Dashboard administrateur
          </h1>
          <p className="text-gray-500 mt-2 max-w-lg">
            Vue d&apos;ensemble de la plateforme CrossTalk
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1E7F88] border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm mb-8">
            {error}
          </div>
        )}

        {!loading && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Card className="border-gray-100 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${stat.color}15` }}
                        >
                          <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{stat.detail}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Users Management */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-[#1E7F88]" />
                    Gestion des utilisateurs
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E7F88]/20 focus:border-[#1E7F88] w-56"
                  />
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Tous les roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les roles</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="PROF">Professeur</SelectItem>
                      <SelectItem value="ELEVE">Eleve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-gray-400 text-xs font-mono">
                          {user.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              user.role === 'ADMIN'
                                ? 'bg-gradient-to-br from-red-500 to-red-600'
                                : user.role === 'PROF'
                                ? 'bg-gradient-to-br from-[#1E7F88] to-[#F1843F]'
                                : 'bg-gradient-to-br from-blue-500 to-blue-600'
                            }`}>
                              {getInitials(user)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {getDisplayName(user)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(val) => handleRoleChange(user.id, val)}
                            disabled={changingRoleId === user.id || user.id === prismaUser?.id}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="PROF">Professeur</SelectItem>
                              <SelectItem value="ELEVE">Eleve</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.id !== prismaUser?.id ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  disabled={deletingId === user.id}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irreversible. L&apos;utilisateur{' '}
                                    <strong>{getDisplayName(user)}</strong> ({user.email}) sera
                                    definitivement supprime ainsi que toutes ses donnees.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-gray-400">
                              Vous
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-10">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun utilisateur trouve</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#F1843F]" />
                Activite recente
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enrollments */}
                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Dernieres inscriptions
                    </h3>
                    <div className="space-y-3">
                      {stats.recentEnrollments.map((enrollment, i) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials(enrollment.user)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {getDisplayName(enrollment.user)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {enrollment.course.language} {enrollment.course.level}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {new Date(enrollment.joinedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </motion.div>
                      ))}
                      {stats.recentEnrollments.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">
                          Aucune inscription recente
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="border-gray-100">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Derniers utilisateurs
                    </h3>
                    <div className="space-y-3">
                      {stats.recentUsers.map((user, i) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                            user.role === 'ADMIN'
                              ? 'bg-gradient-to-br from-red-500 to-red-600'
                              : user.role === 'PROF'
                              ? 'bg-gradient-to-br from-[#1E7F88] to-[#F1843F]'
                              : 'bg-gradient-to-br from-blue-500 to-blue-600'
                          }`}>
                            {getInitials(user)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {getDisplayName(user)}
                            </p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${
                            user.role === 'ADMIN'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : user.role === 'PROF'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                            {user.role === 'ADMIN' ? 'Admin' : user.role === 'PROF' ? 'Prof' : 'Eleve'}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
