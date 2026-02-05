'use client';

import { SignUp } from '@clerk/nextjs';
import { LegalLink } from '@/src/components/LegalLink';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E7F88]/10 to-white">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CrossTalk</h1>
          <p className="text-gray-600 mt-2">Créez votre compte</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#1E7F88] hover:bg-[#1E7F88]/90',
              footerActionLink: 'text-[#1E7F88] hover:text-[#1E7F88]/80',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
        <div className="mt-4 text-center text-xs text-gray-500">
          En créant un compte, vous acceptez nos{' '}
          <LegalLink type="terms" text="Conditions Générales" className="underline hover:text-gray-700" />
          {' et notre '}
          <LegalLink type="privacy" text="Politique de Confidentialité" className="underline hover:text-gray-700" />.
        </div>
      </div>
    </div>
  );
}
