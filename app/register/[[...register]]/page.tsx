'use client';

import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
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
          path="/register"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
