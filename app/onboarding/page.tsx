'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { GraduationCap, BookOpen, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { config } from '@/src/lib/config';

const LANGUAGES = ['Anglais', 'Espagnol', 'Allemand', 'Japonais', 'Italien', 'Chinois', 'Portugais', 'Arabe'];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'ELEVE' | 'PROF' | null>(null);
  const [courseData, setCourseData] = useState({ language: '', level: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: 'ELEVE' | 'PROF') => {
    setSelectedRole(role);
    if (role === 'PROF') {
      setStep(2); // Aller à la création de cours
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called', { selectedRole, user, isLoaded, courseData });
    
    if (!isLoaded) {
      setError('Chargement en cours, veuillez patienter...');
      return;
    }
    
    if (!user) {
      setError('Vous devez être connecté. Redirection...');
      router.push('/sign-in');
      return;
    }
    
    if (!selectedRole) {
      setError('Veuillez sélectionner un rôle');
      return;
    }
    
    if (selectedRole === 'PROF' && (!courseData.language || !courseData.level)) {
      setError('Veuillez sélectionner une langue et un niveau');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('1. Sync user avec Prisma...');
      // 1. Sync user avec Prisma
      const userRes = await fetch(`${config.apiUrl}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          role: selectedRole
        })
      });
      
      console.log('User sync response:', userRes.status);
      if (!userRes.ok) {
        const errData = await userRes.text();
        console.error('Sync error:', errData);
        throw new Error('Erreur sync utilisateur');
      }
      const prismaUser = await userRes.json();
      console.log('2. Prisma user créé:', prismaUser);

      // 2. Si PROF, créer le premier cours
      if (selectedRole === 'PROF') {
        console.log('3. Création du cours...');
        const courseRes = await fetch(`${config.apiUrl}/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: courseData.language,
            level: courseData.level,
            teacherId: prismaUser.id
          })
        });
        console.log('Course response:', courseRes.status);
        if (!courseRes.ok) {
          const errData = await courseRes.text();
          console.error('Course error:', errData);
          throw new Error('Erreur création cours');
        }
        const course = await courseRes.json();
        console.log('4. Cours créé:', course);
      }

      // 3. Mettre à jour Clerk metadata
      console.log('5. Mise à jour Clerk metadata...');
      await user.update({
        unsafeMetadata: {
          role: selectedRole,
          onboardingComplete: true,
          prismaId: prismaUser.id,
        },
      });
      console.log('6. Metadata mis à jour, redirection...');

      // 4. Forcer le refresh de la session et rediriger
      // Le middleware vérifie sessionClaims, donc on force un reload complet
      window.location.href = '/';
    } catch (err) {
      console.error('Erreur onboarding:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'ELEVE',
      title: 'Élève',
      description: 'Je veux apprendre une nouvelle langue avec des professeurs qualifiés',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'PROF',
      title: 'Professeur',
      description: 'Je veux enseigner ma langue et aider des élèves à progresser',
      icon: BookOpen,
      color: 'from-[#1E7F88] to-[#166a72]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E7F88]/10 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Bouton pour se déconnecter */}
        <div className="mb-4 text-right">
          <Button
            onClick={() => signOut(() => router.push('/'))}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>

        {/* Étape 1: Choix du rôle */}
        {step === 1 && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Bienvenue sur CrossTalk ! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                Pour commencer, dites-nous qui vous êtes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id as 'ELEVE' | 'PROF')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-[#1E7F88] bg-[#1E7F88]/5 shadow-lg scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedRole === 'ELEVE' && (
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#1E7F88] hover:bg-[#1E7F88]/90 text-white px-8 py-3 text-lg rounded-xl"
                >
                  {loading ? 'Chargement...' : 'Continuer'}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Étape 2: Création de cours (PROF uniquement) */}
        {step === 2 && selectedRole === 'PROF' && (
          <>
            <button
              onClick={() => { setStep(1); setSelectedRole(null); }}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Créez votre premier cours 📚
              </h1>
              <p className="text-gray-600 text-lg">
                Quelle langue enseignez-vous et à quel niveau ?
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Langue enseignée
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setCourseData({ ...courseData, language: lang })}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          courseData.language === lang
                            ? 'border-[#1E7F88] bg-[#1E7F88]/10 text-[#1E7F88]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Niveau (CECRL)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => setCourseData({ ...courseData, level })}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          courseData.level === level
                            ? 'border-[#1E7F88] bg-[#1E7F88]/10 text-[#1E7F88]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={!courseData.language || !courseData.level || loading}
                className="bg-[#1E7F88] hover:bg-[#1E7F88]/90 text-white px-8 py-3 text-lg rounded-xl disabled:opacity-50"
              >
                {loading ? 'Création en cours...' : 'Créer mon cours et commencer'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
