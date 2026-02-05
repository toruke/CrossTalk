'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { config } from '@/src/lib/config';
import { setAuthToken } from '@/src/services/api';

interface PrismaUser {
  id: number;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PROF' | 'ELEVE';
  enrollments?: Array<{
    id: number;
    courseId: number;
    course: {
      id: number;
      language: string;
      level: string;
      teacher: { id: number; firstName: string; lastName: string; email: string };
    };
  }>;
  coursesTaught?: Array<{
    id: number;
    language: string;
    level: string;
    enrollments: Array<{ user: { id: number; firstName: string; lastName: string; email: string } }>;
  }>;
}

export function usePrismaUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useAuth();
  const [prismaUser, setPrismaUser] = useState<PrismaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!clerkLoaded) return;

      if (!clerkUser) {
        setLoading(false);
        setPrismaUser(null);
        return;
      }

      // Initialiser le token pour les appels API authentifiés
      try {
        const token = await getToken();
        setAuthToken(token);
      } catch (e) {
        console.error("Erreur récupération token", e);
      }

      try {
        let res = await fetch(`${config.apiUrl}/users/me/${clerkUser.id}`);

        // Si 404 et onboarding déjà fait, re-sync automatique (ex: après un reseed)
        if (res.status === 404 && clerkUser.unsafeMetadata?.onboardingComplete) {
          const syncRes = await fetch(`${config.apiUrl}/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress,
              firstName: clerkUser.firstName || null,
              lastName: clerkUser.lastName || null,
              role: clerkUser.unsafeMetadata?.role || 'ELEVE',
            }),
          });
          if (syncRes.ok) {
            // Re-fetch après sync
            res = await fetch(`${config.apiUrl}/users/me/${clerkUser.id}`);
          }
        }

        if (res.ok) {
          const data = await res.json();
          setPrismaUser(data);
        } else if (res.status === 404) {
          // User not synced yet (needs onboarding)
          setPrismaUser(null);
        } else {
          throw new Error('Erreur récupération utilisateur');
        }
      } catch (err) {
        setError('Impossible de récupérer les données utilisateur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clerkUser, clerkLoaded]);

  const role = prismaUser?.role || (clerkUser?.unsafeMetadata?.role as string) || null;
  const isProf = role === 'PROF';
  const isEleve = role === 'ELEVE';
  const isAdmin = role === 'ADMIN';
  const onboardingComplete = clerkUser?.unsafeMetadata?.onboardingComplete as boolean;

  return {
    clerkUser,
    prismaUser,
    loading: !clerkLoaded || loading,
    error,
    role,
    isProf,
    isEleve,
    isAdmin,
    onboardingComplete,
    prismaId: prismaUser?.id || (clerkUser?.unsafeMetadata?.prismaId as number),
  };
}
