import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/register(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Non connecté sur une route protégée -> sign-up
  if (!userId && !isPublicRoute(req)) {
    const signUpUrl = new URL('/sign-up', req.url);
    return NextResponse.redirect(signUpUrl);
  }

  // Connecté -> vérifier si l'utilisateur existe dans Prisma
  if (userId && !isPublicRoute(req)) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/users/me/${userId}`);

      if (res.status === 404) {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const hasOnboarded = clerkUser.unsafeMetadata?.onboardingComplete === true;

        // Auto-sync uniquement si l'utilisateur a déjà fait l'onboarding (ex: après un reseed)
        // Les nouveaux utilisateurs doivent passer par l'onboarding pour choisir leur rôle
        if (hasOnboarded) {
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          if (email) {
            const syncRes = await fetch(`${apiUrl}/users/sync`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                clerkId: userId,
                email,
                firstName: clerkUser.firstName || null,
                lastName: clerkUser.lastName || null,
                role: (clerkUser.unsafeMetadata?.role as string) || 'ELEVE',
              }),
            });

            if (syncRes.ok) {
              if (isOnboardingRoute(req)) {
                return NextResponse.redirect(new URL('/', req.url));
              }
              return NextResponse.next();
            }
          }
        }

        // Nouvel utilisateur ou sync échoué -> onboarding
        if (!isOnboardingRoute(req)) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      } else if (res.ok && isOnboardingRoute(req)) {
        // L'utilisateur existe déjà en Prisma mais est sur /onboarding -> rediriger vers l'accueil
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (e) {
      // API non joignable, laisser passer
      console.error('API check failed:', e);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
