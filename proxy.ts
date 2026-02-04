import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
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

  // Connecté mais pas encore onboardé -> vérifier dans Prisma
  if (userId && !isOnboardingRoute(req) && !isPublicRoute(req)) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/users/me/${userId}`);
      if (res.status === 404) {
        const onboardingUrl = new URL('/onboarding', req.url);
        return NextResponse.redirect(onboardingUrl);
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
