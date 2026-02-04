'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';

export const Navbar = ({ onNavigate, currentPage }: { onNavigate: (page: string) => void, currentPage: string }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const role = user?.unsafeMetadata?.role as string | undefined;

  // Items de navigation selon le rôle
  const getNavItems = () => {
    const items = [
      { key: 'home', label: 'Accueil' },
    ];

    if (role === 'PROF') {
      items.push({ key: 'my-courses', label: 'Mes cours' });
      items.push({ key: 'students', label: 'Mes élèves' });
    } else if (role === 'ELEVE') {
      items.push({ key: 'courses', label: 'Cours' });
      items.push({ key: 'my-courses', label: 'Mes cours' });
      items.push({ key: 'teachers', label: 'Mes professeurs' });
    } else if (role === 'ADMIN') {
      items.push({ key: 'courses', label: 'Cours' });
      items.push({ key: 'teachers', label: 'Professeurs' });
      items.push({ key: 'students', label: 'Élèves' });
    } else {
      // Visiteur non connecté
      items.push({ key: 'courses', label: 'Cours' });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Image
              src="/images/logo-crossTalk.png"
              alt="CrossTalk Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1E7F88] to-[#F1843F]">
              CrossTalk
            </span>
          </div>

          {/* Desktop nav - centered */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.key
                    ? 'text-[#1E7F88] bg-[#1E7F88]/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#1E7F88] hover:bg-[#1E7F88]/5 rounded-full"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </SignedOut>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                setMobileOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.key
                  ? 'text-[#1E7F88] bg-[#1E7F88]/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
